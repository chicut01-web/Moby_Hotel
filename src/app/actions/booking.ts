"use server";

import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getAvailableRooms } from "@/lib/rooms";
import { bookingSchema, type BookingMessages } from "@/lib/validation/booking";
import { sendEmail } from "@/lib/email/send";
import {
  guestConfirmationEmail,
  hostelNotificationEmail,
} from "@/lib/email/templates";
import { SITE } from "@/lib/site";

export type BookingActionResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

async function localizedMessages(locale: string): Promise<BookingMessages> {
  const t = await getTranslations({
    locale,
    namespace: "prenota.form.errors",
  });
  return {
    name: t("name"),
    email: t("email"),
    room: t("room"),
    checkIn: t("checkIn"),
    checkOut: t("checkOut"),
    checkOutAfter: t("checkOutAfter"),
    checkInFuture: t("checkInFuture"),
    guestsMin: t("guestsMin"),
  };
}

export async function submitBookingRequest(
  raw: unknown,
): Promise<BookingActionResult> {
  const localeGuess =
    typeof raw === "object" && raw !== null && "locale" in raw
      ? String((raw as { locale: unknown }).locale)
      : "it";
  const locale = localeGuess === "en" ? "en" : "it";
  const t = await getTranslations({
    locale,
    namespace: "prenota.form.errors",
  });

  // 1. Validazione (stesso schema del client, messaggi localizzati).
  const parsed = bookingSchema(await localizedMessages(locale)).safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }
  const data = parsed.data;

  const supabase = await createClient();

  // 2. La camera deve esistere, essere attiva e avere capienza sufficiente
  //    (la RLS pubblica espone solo camere attive).
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, name_it, name_en, capacity")
    .eq("id", data.room_id)
    .single();

  if (roomError || !room) {
    return { ok: false, fieldErrors: { room_id: t("room") } };
  }
  if (data.num_guests > room.capacity) {
    return { ok: false, fieldErrors: { num_guests: t("guestsMax") } };
  }

  // 2b. La camera deve essere ancora disponibile per le date scelte
  //     (blocchi + prenotazioni confermate; fallback graceful se RPC assente).
  const available = await getAvailableRooms(data.check_in, data.check_out);
  if (!available.some((r) => r.id === data.room_id)) {
    return { ok: false, fieldErrors: { room_id: t("roomUnavailable") } };
  }

  // 3. Insert (RLS: insert pubblico su booking_requests, stato pending).
  const { error: insertError } = await supabase.from("booking_requests").insert({
    room_id: data.room_id,
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    guest_phone: data.guest_phone || null,
    check_in: data.check_in,
    check_out: data.check_out,
    num_guests: data.num_guests,
    message: data.message || null,
    locale: data.locale,
  });

  if (insertError) {
    console.error("booking insert fallito:", insertError.message);
    return { ok: false, formError: t("generic") };
  }

  // 4. Email best-effort: la richiesta è già salvata, un errore qui non blocca.
  const emailData = {
    guestName: data.guest_name,
    guestEmail: data.guest_email,
    guestPhone: data.guest_phone || undefined,
    roomName: data.locale === "en" ? room.name_en : room.name_it,
    checkIn: data.check_in,
    checkOut: data.check_out,
    numGuests: data.num_guests,
    message: data.message || undefined,
    locale: data.locale,
  };
  const hostelTo = process.env.BOOKING_NOTIFICATION_EMAIL || SITE.email;
  const guest = guestConfirmationEmail(emailData);
  const hostel = hostelNotificationEmail(emailData);
  await Promise.allSettled([
    sendEmail({ to: data.guest_email, ...guest }),
    sendEmail({ to: hostelTo, replyTo: data.guest_email, ...hostel }),
  ]);

  return { ok: true };
}
