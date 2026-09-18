export const SITE = {
  name: "Hub for European Youth",
  shortName: "European Youth Hub",
  org: "Moby Dick ETS",
  email: "info@mobydickets.it",
  pec: "mobydickets@pec.it",
  address: "Centro storico, 84042 Acerno (SA), Italia",
  locality: "Acerno (SA)",
  orgOperational: "Via Enrico Bottiglieri snc, Salerno",
  orgLegal: "Via Cupa Parisi 11, Salerno",
} as const;

export const MAPS_QUERY = "Convento di Sant'Antonio, Acerno SA";

export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  MAPS_QUERY,
)}&output=embed`;

export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  MAPS_QUERY,
)}`;
