export type RoomType = "dorm" | "private" | "accessible";

export interface Room {
  id: string;
  name_it: string;
  name_en: string;
  description_it: string;
  description_en: string;
  type: RoomType;
  capacity: number;
  beds: number;
  price_per_night: number;
  is_accessible: boolean;
  images: string[];
  is_active: boolean;
}

export interface BookingStatus {
  status: "pending" | "confirmed" | "declined";
}
