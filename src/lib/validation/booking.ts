import { z } from "zod";

/** Messaggi di errore localizzati, iniettati da chi costruisce lo schema. */
export type BookingMessages = {
  name: string;
  email: string;
  room: string;
  checkIn: string;
  checkOut: string;
  checkOutAfter: string;
  checkInFuture: string;
  guestsMin: string;
};

/** Data odierna in formato YYYY-MM-DD (confronto lessicografico tra date ISO). */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function bookingSchema(m: BookingMessages) {
  return z
    .object({
      guest_name: z.string().trim().min(2, m.name),
      guest_email: z.string().trim().pipe(z.email(m.email)),
      guest_phone: z
        .string()
        .trim()
        .max(40)
        .optional()
        .or(z.literal("")),
      room_id: z.string().min(1, m.room),
      check_in: z.string().min(1, m.checkIn),
      check_out: z.string().min(1, m.checkOut),
      num_guests: z
        .number({ error: m.guestsMin })
        .int()
        .min(1, m.guestsMin),
      message: z.string().trim().max(1000).optional().or(z.literal("")),
      locale: z.enum(["it", "en"]),
    })
    .refine((d) => d.check_out > d.check_in, {
      path: ["check_out"],
      message: m.checkOutAfter,
    })
    .refine((d) => d.check_in >= todayISO(), {
      path: ["check_in"],
      message: m.checkInFuture,
    });
}

export type BookingInput = z.infer<ReturnType<typeof bookingSchema>>;
