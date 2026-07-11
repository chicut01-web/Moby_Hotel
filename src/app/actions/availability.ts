"use server";

import { getAvailableRooms } from "@/lib/rooms";
import type { BookingRoomOption } from "@/components/booking-form";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Opzioni camera disponibili per le date scelte (per il form pubblico). */
export async function fetchAvailableRooms(
  checkIn: string,
  checkOut: string,
  locale: string,
): Promise<BookingRoomOption[] | null> {
  if (!DATE_RE.test(checkIn) || !DATE_RE.test(checkOut) || checkOut <= checkIn) {
    return null;
  }
  const rooms = await getAvailableRooms(checkIn, checkOut);
  return rooms.map((r) => ({
    id: r.id,
    name: locale === "en" ? r.name_en : r.name_it,
    capacity: r.capacity,
  }));
}
