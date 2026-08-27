import type { Room } from "./types";

/**
 * Foto locali di fallback per le camere, finché l'array `images` su Supabase
 * è vuoto. Mappate per nome (seed). Scatti reali della struttura, ottimizzati
 * in public/images/.
 *
 * Le camerate non ci sono: nessuno dei due servizi fotografici le ha riprese
 * arredate — tutte le camere fotografate hanno al più due letti, mentre le
 * camerate ne hanno tre e quattro. Mettere lì una camera doppia direbbe agli
 * ospiti una capienza che non è quella. Meglio nessuna foto che una che
 * mente: la card mostra il motivo ad archi finché non arrivano gli scatti.
 */
const BY_NAME: Record<string, string> = {
  "Camera del Pozzo": "/images/camera-privata.jpg",
  "Camera dell'Affresco": "/images/camera-doppia.jpg",
  "Camera San Francesco": "/images/camera-voltata.jpg",
};

const BY_TYPE: Partial<Record<Room["type"], string>> = {
  private: "/images/camera-privata.jpg",
  accessible: "/images/camera-voltata.jpg",
};

/**
 * Prima immagine della camera: DB se presente, altrimenti foto locale.
 * `null` quando non esiste uno scatto onesto per quella camera.
 */
export function roomCoverImage(room: Room): string | null {
  return room.images?.[0] ?? BY_NAME[room.name_it] ?? BY_TYPE[room.type] ?? null;
}
