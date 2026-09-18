import "server-only";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import { PLACEHOLDER_ROOMS } from "./placeholder-rooms";
import type { Room } from "./types";

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
      return [];
    }
    return (data ?? []) as Room[];
  } catch {
    return [];
  }
}

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
      return getActiveRooms();
    }
    return (data ?? []) as Room[];
  } catch {
    return getActiveRooms();
  }
}
