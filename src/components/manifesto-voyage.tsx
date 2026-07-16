import { useTranslations } from "next-intl";
import { SailboatIcon } from "@/components/sailboat";
import { OceanWaves } from "@/components/ocean-waves";
import { Clouds } from "@/components/clouds";
import { InkReveal } from "@/components/ink-reveal";
import { cn } from "@/lib/utils";

const LEGS = [
  { key: "rotta", num: "01", accent: "text-cotto", ring: "border-cotto/50" },
  { key: "orizzonti", num: "02", accent: "text-salvia", ring: "border-salvia/50" },
  { key: "persone", num: "03", accent: "text-tramonto", ring: "border-tramonto/50" },
] as const;

/** Rotta che serpeggia lungo i tre "porti" della traversata (0–3000 × 0–800). */
const ROUTE_D =
  "M -40 560 C 260 420 420 300 640 340 C 860 380 980 560 1240 560 C 1500 560 1600 300 1860 280 C 2120 260 2260 480 2480 500 C 2700 520 2880 420 3040 360";

/**
 * Il manifesto come traversata: la sezione si "aggancia" e lo scroll
 * verticale diventa navigazione orizzontale lungo una carta nautica.
 * Le tre dichiarazioni sono tre bordi della rotta, tipografia enorme
 * senza card; il veliero resta a sinistra del viewport e il mondo gli
 * scorre incontro, la rotta tratteggiata si inchiostra col progresso.
 * Tutta la coreografia è CSS scroll-driven (`.manifesto-*` in
 * globals.css): senza supporto — o con prefers-reduced-motion — la
 * sezione degrada in un racconto verticale statico.
 */
export function ManifestoVoyage() {
  const t = useTranslations("home.manifesto");

  return (
    <section aria-labelledby="manifesto-heading" className="manifesto-voyage">
      <div className="manifesto-pin bg-gradient-to-b from-salvia-soft/40 via-calce to-calce">
        <Clouds />

        <div className="manifesto-eyebrow relative z-10 pt-10 text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="manifesto-heading" className="sr-only">
            {t("title")}
          </h2>
        </div>

        <div className="manifesto-track">
          {/* Carta nautica: guida tratteggiata + tratto che si inchiostra */}
          <svg
            aria-hidden="true"
            viewBox="0 0 3000 800"
            preserveAspectRatio="none"
            fill="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <path
              d={ROUTE_D}
              pathLength={1}
              stroke="var(--inchiostro)"
              strokeOpacity="0.16"
              strokeWidth="2"
              strokeDasharray="0.006 0.005"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="manifesto-route-ink"
              d={ROUTE_D}
              pathLength={1}
              stroke="var(--salvia)"
              strokeOpacity="0.45"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Porti di scalo sulla rotta */}
            <g stroke="var(--inchiostro)" strokeOpacity="0.35">
              <circle cx="640" cy="340" r="7" fill="var(--cotto)" strokeWidth="6" strokeOpacity="0.12" />
              <circle cx="1860" cy="280" r="7" fill="var(--salvia)" strokeWidth="6" strokeOpacity="0.12" />
              <circle cx="2480" cy="500" r="7" fill="var(--tramonto)" strokeWidth="6" strokeOpacity="0.12" />
            </g>
          </svg>

          {LEGS.map(({ key, num, accent, ring }) => (
            <article key={key} className="manifesto-leg">
              <span aria-hidden="true" className="manifesto-num font-serif italic">
                {num}
              </span>
              <div className="relative max-w-2xl">
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full border bg-card/70 font-serif text-sm",
                    ring,
                    accent,
                  )}
                >
                  {num}
                </span>
                <InkReveal
                  as="h3"
                  text={t(`cards.${key}.title`)}
                  className="mt-6 text-[clamp(2.2rem,5.2vw,4.6rem)] leading-[1.04]"
                />
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-salvia sm:text-xl">
                  {t(`cards.${key}.body`)}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Il veliero resta in scena: è il mondo a scorrergli incontro */}
        <div aria-hidden="true" className="manifesto-boat">
          <SailboatIcon className="sail-roll w-16 text-inchiostro/70 sm:w-20" />
        </div>

        <OceanWaves className="h-24" />
      </div>
    </section>
  );
}
