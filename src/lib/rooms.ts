import "server-only";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import { PLACEHOLDER_ROOMS } from "./placeholder-rooms";
import type { Room } from "./types";

/**
 * Camere attive, ordinate per prezzo.
 * - Senza credenziali Supabase: usa le camere segnaposto (dev/design).
 * - Con Supabase: legge `rooms` attive via RLS pubblica con il client senza
 *   cookie (compatibile con prerender/ISR); in caso di errore restituisce
 *   lista vuota (la pagina mostra lo stato "vuoto").
 */
export async function getActiveRooms(): Promise<Room[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_ROOMS;
  }

  try {
    const supabase = createPublicClient();
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

/**
 * Camere disponibili per le date scelte, via RPC `get_available_rooms`
 * (security definer: considera blocchi e prenotazioni confermate).
 * Fallback graceful a tutte le camere attive se l'RPC non esiste ancora
 * (migrazione 0002 non applicata) o fallisce.
 */
export async function getAvailableRooms(
  checkIn: string,
  checkOut: string,
): Promise<Room[]> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_ROOMS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.rpc("get_available_rooms", {
      p_check_in: checkIn,
      p_check_out: checkOut,
    });

    if (error) {
      console.warn(
        "RPC get_available_rooms non disponibile, fallback a rooms attive:",
        error.message,
      );
      return getActiveRooms();
    }
    return (data ?? []) as Room[];
  } catch (err) {
    console.error("Supabase non raggiungibile (availability):", err);
    return getActiveRooms();
  }
}
