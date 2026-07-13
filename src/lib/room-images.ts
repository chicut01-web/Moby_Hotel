import type { Room } from "./types";

/**
 * Foto locali di fallback per le camere, finché l'array `images` su Supabase
 * è vuoto. Mappate per nome (seed) con fallback per tipo. Scatti reali della
 * struttura, ottimizzati in public/images/.
 */
const BY_NAME: Record<string, string> = {
  "Camerata del Chiostro": "/images/camerata.jpg",
  "Camerata dei Pellegrini": "/images/camerata-2.jpg",
  "Camera del Pozzo": "/images/camera-privata.jpg",
  "Camera dell'Affresco": "/images/camera-doppia.jpg",
  "Camera San Francesco": "/images/camera-voltata.jpg",
};

const BY_TYPE: Record<Room["type"], string> = {
  dorm: "/images/camerata.jpg",
  private: "/images/camera-privata.jpg",
  accessible: "/images/camera-voltata.jpg",
};

/** Prima immagine della camera: DB se presente, altrimenti foto locale. */
export function roomCoverImage(room: Room): string {
  return room.images?.[0] ?? BY_NAME[room.name_it] ?? BY_TYPE[room.type];
}
