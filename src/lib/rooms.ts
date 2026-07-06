import "server-only";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { PLACEHOLDER_ROOMS } from "./placeholder-rooms";
import type { Room } from "./types";

/**
 * Camere attive, ordinate per prezzo.
 * - Senza credenziali Supabase: usa le camere segnaposto (dev/design).
 * - Con Supabase: legge `rooms` attive via RLS pubblica; in caso di errore
 *   restituisce lista vuota (la pagina mostra lo stato "vuoto").
 */
export async function getActiveRooms(): Promise<Room[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_ROOMS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("is_active", true)
      .order("price_per_night", { ascending: true });

    if (error) {
      console.error("Errore lettura rooms:", error.message);
      return [];
    }
    return (data ?? []) as Room[];
  } catch (err) {
    console.error("Supabase non raggiungibile:", err);
    return [];
  }
}
