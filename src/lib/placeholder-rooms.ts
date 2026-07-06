import type { Room } from "./types";

/**
 * Camere segnaposto usate finché Supabase non è configurato (o per il design
 * in locale). Rispecchiano il vero mix del primo piano: camerate e camere
 * private attorno al chiostro. Prezzi indicativi.
 */
export const PLACEHOLDER_ROOMS: Room[] = [
  {
    id: "ph-camerata-chiostro",
    name_it: "Camerata del Chiostro",
    name_en: "Cloister Dorm",
    description_it:
      "Camerata da quattro letti singoli affacciata sul porticato, soffitto a volta e pavimento in cotto. Bagni comuni a pochi passi.",
    description_en:
      "Four single-bed dorm overlooking the portico, with a vaulted ceiling and terracotta floor. Shared bathrooms a few steps away.",
    type: "dorm",
    capacity: 4,
    beds: 4,
    price_per_night: 25,
    is_accessible: false,
    images: [],
    is_active: true,
  },
  {
    id: "ph-camerata-pellegrini",
    name_it: "Camerata dei Pellegrini",
    name_en: "Pilgrims' Dorm",
    description_it:
      "Tre letti singoli sotto travi a vista, ideale per piccoli gruppi ed escursionisti diretti ai sentieri del Parco.",
    description_en:
      "Three single beds under exposed beams, ideal for small groups and hikers heading to the Park's trails.",
    type: "dorm",
    capacity: 3,
    beds: 3,
    price_per_night: 22,
    is_accessible: false,
    images: [],
    is_active: true,
  },
  {
    id: "ph-camera-pozzo",
    name_it: "Camera del Pozzo",
    name_en: "Well Room",
    description_it:
      "Camera doppia tranquilla con vista sul giardino del chiostro e il vecchio pozzo. Due letti singoli o matrimoniale su richiesta.",
    description_en:
      "Quiet double room overlooking the cloister garden and the old well. Two single beds or a double on request.",
    type: "private",
    capacity: 2,
    beds: 2,
    price_per_night: 68,
    is_accessible: false,
    images: [],
    is_active: true,
  },
  {
    id: "ph-camera-affresco",
    name_it: "Camera dell'Affresco",
    name_en: "Fresco Room",
    description_it:
      "Camera matrimoniale raccolta, vicino a uno degli affreschi sei-settecenteschi riaffiorati durante i restauri.",
    description_en:
      "Cosy double room near one of the 17th–18th-century frescoes that resurfaced during the restoration.",
    type: "private",
    capacity: 2,
    beds: 1,
    price_per_night: 78,
    is_accessible: false,
    images: [],
    is_active: true,
  },
  {
    id: "ph-camera-accessibile",
    name_it: "Camera San Francesco",
    name_en: "San Francesco Room",
    description_it:
      "Camera accessibile al piano terra, vicino alla reception, con bagno dedicato e accesso senza barriere al chiostro.",
    description_en:
      "Accessible ground-floor room near reception, with a private step-free bathroom and barrier-free access to the cloister.",
    type: "accessible",
    capacity: 2,
    beds: 2,
    price_per_night: 70,
    is_accessible: true,
    images: [],
    is_active: true,
  },
];
