import { cn } from "@/lib/utils";

/**
 * Freccia "rotta di mappa antica": percorso curvo tratteggiato che termina in
 * punta di freccia, con una piccola ✕ da tesoro. Dentro un elemento `group`,
 * su hover i trattini marciano (`.map-trail-dash`) e la ✕ appare
 * (`.map-trail-x`) — keyframes in globals.css.
 */
export function MapTrailArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 16"
      fill="none"
      aria-hidden="true"
      className={cn("h-4 w-11 shrink-0", className)}
    >
      {/* Rotta tratteggiata, leggermente ondulata come su una carta nautica */}
      <path
        d="M 1.5 11.5 C 9 4.5, 16 14.5, 24 8.5 S 33 5.5, 36.5 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="map-trail-dash"
      />
      {/* Punta di freccia */}
      <path
        d="M 33.5 3.5 L 38.5 7.6 L 32.8 9.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* ✕ del tesoro, color tramonto */}
      <g
        stroke="var(--tramonto)"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="map-trail-x"
      >
        <path d="M 40 10.2 L 43 13.2" />
        <path d="M 43 10.2 L 40 13.2" />
      </g>
    </svg>
  );
}
