/* eslint-disable @typescript-eslint/no-unused-vars */
import { PLACEHOLDER_ROOMS } from "../placeholder-rooms";

export interface MockBookingRequest {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  num_guests: number;
  message: string | null;
  status: "pending" | "confirmed" | "declined";
  locale: string;
  created_at: string;
  room_id: string;
}

// In-memory module-level store of mock requests so updates persist during the container's lifecycle.
const mockRequests: MockBookingRequest[] = [
  {
    id: "mock-req-1",
    guest_name: "Marco Rossi",
    guest_email: "marco.rossi@example.com",
    guest_phone: "+39 333 1234567",
    check_in: "2026-08-10",
    check_out: "2026-08-15",
    num_guests: 2,
    message: "Vorremmo una camera silenziosa se possibile, grazie!",
    status: "pending",
    locale: "it",
    created_at: new Date().toISOString(),
    room_id: "ph-camera-pozzo"
  },
  {
    id: "mock-req-2",
    guest_name: "Alice Smith",
    guest_email: "alice.smith@example.com",
    guest_phone: "+1 555-0199",
    check_in: "2026-09-01",
    check_out: "2026-09-04",
    num_guests: 1,
    message: "Looking forward to my stay at the monastery!",
    status: "confirmed",
    locale: "en",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    room_id: "ph-camerata-chiostro"
  }
];

interface CookieStore {
  get(name: string): { value: string } | undefined;
}

export function createMockClient(isServer = false, cookieStore?: CookieStore) {
  return {
    auth: {
      getUser: async () => {
        let hasSession = false;
        if (isServer && cookieStore) {
          hasSession = cookieStore.get("sb-mock-session")?.value === "true";
        } else if (typeof window !== "undefined") {
          hasSession = document.cookie.includes("sb-mock-session=true");
        }
        if (hasSession) {
          return { data: { user: { id: "mock-admin", email: "admin@mobyhotel.com" } }, error: null };
        }
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async ({ email, password: _password }: { email: string; password?: string }) => {
        if (typeof window !== "undefined") {
          document.cookie = "sb-mock-session=true; path=/; max-age=3600";
        }
        return { data: { user: { id: "mock-admin", email } }, error: null };
      },
      signOut: async () => {
        if (typeof window !== "undefined") {
          document.cookie = "sb-mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        return { error: null };
      }
    },
    from: (table: string) => {
      return {
        select: (_queryStr = "*") => {
          return {
            eq: (_field: string, val: unknown) => {
              return {
                single: async () => {
                  if (table === "rooms") {
                    const room = PLACEHOLDER_ROOMS.find(r => r.id === val);
                    return { data: room || null, error: room ? null : { message: "Room not found" } };
                  }
                  if (table === "booking_requests") {
                    const req = mockRequests.find(r => r.id === val);
                    if (req) {
                      const room = PLACEHOLDER_ROOMS.find(p => p.id === req.room_id);
                      return { data: { ...req, rooms: room ? { name_it: room.name_it, name_en: room.name_en } : null }, error: null };
                    }
                    return { data: null, error: { message: "Request not found" } };
                  }
                  return { data: null, error: null };
                }
              };
            },
            order: (_field: string, _options?: unknown) => {
              return {
                then: async (resolve: (value: { data: unknown[]; error: unknown }) => void) => {
                  if (table === "booking_requests") {
                    const sorted = [...mockRequests].sort((a, b) => {
                      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
                    const processed = sorted.map(req => {
                      const room = PLACEHOLDER_ROOMS.find(p => p.id === req.room_id);
                      return {
                        ...req,
                        rooms: room ? { name_it: room.name_it, name_en: room.name_en } : null
                      };
                    });
                    return resolve({ data: processed, error: null });
                  }
                  return resolve({ data: [], error: null });
                }
              };
            }
          };
        },
        insert: async (data: {
          guest_name: string;
          guest_email: string;
          guest_phone?: string | null;
          check_in: string;
          check_out: string;
          num_guests: number;
          message?: string | null;
          locale: string;
          room_id: string;
        }) => {
          const newReq: MockBookingRequest = {
            id: "mock-req-" + Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            status: "pending" as const,
            guest_name: data.guest_name,
            guest_email: data.guest_email,
            guest_phone: data.guest_phone || null,
            check_in: data.check_in,
            check_out: data.check_out,
            num_guests: data.num_guests,
            message: data.message || null,
            locale: data.locale,
            room_id: data.room_id
          };
          mockRequests.push(newReq);
          return { data: newReq, error: null };
        },
        update: (updateData: Partial<MockBookingRequest>) => {
          return {
            eq: (_field: string, val: unknown) => {
              return {
                select: (_selQuery?: string) => {
                  return {
                    single: async () => {
                      if (table === "booking_requests") {
                        const idx = mockRequests.findIndex(r => r.id === val);
                        if (idx !== -1) {
                          mockRequests[idx] = { ...mockRequests[idx], ...updateData };
                          const updated = mockRequests[idx];
                          const room = PLACEHOLDER_ROOMS.find(p => p.id === updated.room_id);
                          return {
                            data: { ...updated, rooms: room ? { name_it: room.name_it, name_en: room.name_en } : null },
                            error: null
                          };
                        }
                      }
                      return { data: null, error: { message: "Not found" } };
                    }
                  };
                }
              };
            }
          };
        }
      };
    }
  };
}
