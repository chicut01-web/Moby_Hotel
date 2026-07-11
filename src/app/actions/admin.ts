"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { bookingStatusEmail } from "@/lib/email/templates";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

async function updateBookingStatus(
  requestId: string,
  status: "confirmed" | "declined",
): Promise<AdminActionResult> {
  const supabase = await createClient();

  // Solo admin autenticato (la RLS blocca comunque gli anonimi).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "unauthenticated" };
  }

  const { data: request, error } = await supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", requestId)
    .select("*, rooms(name_it, name_en)")
    .single();

  if (error || !request) {
    console.error("update booking status fallito:", error?.message);
    return { ok: false, error: "update_failed" };
  }

  // Email esito all'ospite, best-effort.
  const locale = request.locale === "en" ? "en" : "it";
  const roomName =
    (locale === "en" ? request.rooms?.name_en : request.rooms?.name_it) ?? "—";
  const mail = bookingStatusEmail({
    status,
    locale,
    guestName: request.guest_name,
    roomName,
    checkIn: request.check_in,
    checkOut: request.check_out,
    numGuests: request.num_guests,
  });
  await sendEmail({ to: request.guest_email, ...mail });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function confirmBooking(
  requestId: string,
): Promise<AdminActionResult> {
  return updateBookingStatus(requestId, "confirmed");
}

export async function declineBooking(
  requestId: string,
): Promise<AdminActionResult> {
  return updateBookingStatus(requestId, "declined");
}
