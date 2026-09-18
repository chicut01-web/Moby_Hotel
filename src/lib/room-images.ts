import type { Room } from "./types";

const BY_NAME: Record<string, string> = {
  "Camera del Pozzo": "/images/camera-privata.jpg",
  "Camera dell'Affresco": "/images/camera-doppia.jpg",
  "Camera San Francesco": "/images/camera-voltata.jpg",
};

const BY_TYPE: Partial<Record<Room["type"], string>> = {
  private: "/images/camera-privata.jpg",
  accessible: "/images/camera-voltata.jpg",
};

export function roomCoverImage(room: Room): string | null {
  return room.images?.[0] ?? BY_NAME[room.name_it] ?? BY_TYPE[room.type] ?? null;
}
