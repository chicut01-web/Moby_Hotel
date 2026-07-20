import { useTranslations } from "next-intl";
import {
  Footprints,
  TreePine,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { CompassRose } from "@/components/compass-rose";
import { MapMarker } from "@/components/map-marker";
import { cn } from "@/lib/utils";

/**
 * Punti di interesse sulla carta: coordinate in percentuale, identiche
 * nel viewBox 800×520 dell'SVG (che usa preserveAspectRatio="none" su un
 * contenitore con lo stesso aspect ratio, quindi % contenitore = %
 * viewBox e le rotte tratteggiate arrivano esattamente sotto i marker).
 */
const POIS: ReadonlyArray<{
  key: "sentieri" | "cascate" | "parco" | "gusto";
  Icon: LucideIcon;
  x: number;
  y: number;
  accent: string;
}> = [
  { key: "sentieri", Icon: Footprints, x: 18, y: 22, accent: "text-cotto border-cotto/50" },
  { key: "cascate", Icon: Waves, x: 76, y: 18, accent: "text-salvia border-salvia/50" },
  { key: "parco", Icon: TreePine, x: 15, y: 68, accent: "text-salvia border-salvia/50" },
  { key: "gusto", Icon: UtensilsCrossed, x: 78, y: 72, accent: "text-tramonto border-tramonto/50" },
];

/** Rotte tratteggiate da Acerno (400,250) verso i POI, in unità viewBox. */
const ROUTES = [
  "M 400 250 C 320 210 230 170 144 114",
  "M 400 250 C 470 200 540 150 608 94",
  "M 400 250 C 310 290 210 320 120 354",
  "M 400 250 C 480 300 550 340 624 374",
];

/**
 * Carta illustrata dei Picentini nello stile "carta nautica" del brand:
 * curve di livello a inchiostro, rotte tratteggiate da Acerno ai punti
 * di interesse, marker con etichette sempre visibili (niente
 * tooltip-only) e anello pulse decorativo (spento con reduced-motion).
 */
export function TerritoryMap() {
  const t = useTranslations("territorio");

  return (
    <div
      role="img"
      aria-label={t("mapLabel")}
      className="relative aspect-[800/520] overflow-hidden rounded-3xl border border-border/70 bg-card/70"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 800 520"
        preserveAspectRatio="none"
        fill="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* Curve di livello e crinali, a inchiostro tenue */}
        <g stroke="var(--inchiostro)" strokeOpacity="0.07" strokeWidth="1.5">
          <path d="M 60 180 Q 140 120 230 150 T 380 130" />
          <path d="M 100 220 Q 180 170 270 195 T 420 175" />
          <path d="M 420 430 Q 520 385 620 415 T 780 395" />
          <path d="M 460 470 Q 560 430 660 455" />
          <path d="M 520 200 Q 600 165 690 205" />
          <path d="M 60 420 Q 130 390 210 410" />
        </g>
        {/* Vette stilizzate */}
        <g stroke="var(--inchiostro)" strokeOpacity="0.18" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M 250 82 L 268 56 L 286 82" />
          <path d="M 292 88 L 306 68 L 320 88" />
          <path d="M 660 300 L 676 276 L 692 300" />
          <path d="M 150 470 L 164 448 L 178 470" />
        </g>
        {/* Rotte tratteggiate da Acerno ai punti di interesse */}
        <g
          stroke="var(--salvia)"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 6"
        >
          {ROUTES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>

      {/* Acerno, al centro della carta */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
        style={{ left: "50%", top: "48%" }}
      >
        <CompassRose className="mx-auto size-11 text-inchiostro/70 sm:size-14" />
        <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cotto sm:text-[0.65rem]">
          {t("acerno")}
        </span>
      </div>

      {POIS.map(({ key, Icon, x, y, accent }) => (
        <div
          key={key}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <MapMarker
            className={cn(
              "mx-auto size-9 items-center justify-center rounded-full border bg-card shadow-sm sm:size-11",
              accent,
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full border border-current opacity-40 [animation-duration:2.8s] motion-reduce:hidden"
            />
            <Icon className="m-auto size-4 sm:size-5" aria-hidden="true" />
          </MapMarker>
          <span className="mt-1.5 block max-w-24 text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.12em] text-inchiostro/80 sm:max-w-none sm:text-[0.65rem]">
            {t(`items.${key}`)}
          </span>
        </div>
      ))}
    </div>
  );
}
