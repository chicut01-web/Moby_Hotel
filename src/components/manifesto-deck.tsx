import { useTranslations } from "next-intl";
import { CompassRose } from "@/components/compass-rose";
import { InkReveal } from "@/components/ink-reveal";
import { cn } from "@/lib/utils";

const CARDS = [
  { key: "rotta", numeral: "I", accent: "text-cotto" },
  { key: "orizzonti", numeral: "II", accent: "text-salvia" },
  { key: "persone", numeral: "III", accent: "text-tramonto" },
] as const;

/**
 * Il manifesto dell'Hub come mazzo di carte nautiche: le tre card sono
 * sticky e si impilano una sopra l'altra durante lo scroll. Nei browser
 * con scroll-driven animations la carta che entra si raddrizza da un
 * tilt 3D e quella coperta si ritira nel mazzo (scala + rotazione),
 * mentre dietro una rotta tratteggiata si "inchiostra" e la rosa dei
 * venti ruota col progresso. Tutta la coreografia è CSS (vedi
 * `.manifesto-*` in globals.css); senza supporto resta l'impilamento
 * sticky, con prefers-reduced-motion un semplice elenco statico.
 */
export function ManifestoDeck() {
  const t = useTranslations("home.manifesto");

  return (
    <section aria-labelledby="manifesto-heading" className="manifesto-deck relative">
      {/* Rotta di fondo: guida tratteggiata + tratto che si disegna + bussola */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          fill="none"
          className="manifesto-route absolute left-1/2 top-0 h-full w-48 -translate-x-1/2 sm:w-72"
        >
          <path
            d="M 50 0 C 14 140 88 260 50 420 C 16 560 86 660 50 820 C 30 910 62 950 50 1000"
            pathLength={1}
            stroke="var(--inchiostro)"
            strokeOpacity="0.14"
            strokeWidth="2"
            strokeDasharray="0.012 0.009"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="manifesto-route-ink"
            d="M 50 0 C 14 140 88 260 50 420 C 16 560 86 660 50 820 C 30 910 62 950 50 1000"
            pathLength={1}
            stroke="var(--salvia)"
            strokeOpacity="0.4"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="manifesto-compass sticky top-[9vh] flex justify-end pr-[4%]">
          <CompassRose className="size-20 opacity-[0.14] sm:size-28" />
        </div>
      </div>

      <div className="relative text-center">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 id="manifesto-heading" className="sr-only">
          {t("title")}
        </h2>
      </div>

      <div className="relative mx-auto mt-10 max-w-3xl px-4 sm:px-6">
        {CARDS.map(({ key, numeral, accent }) => (
          <article
            key={key}
            className="manifesto-card flex min-h-[58vh] flex-col items-center justify-center rounded-[2rem] border border-border/70 bg-card px-7 py-14 text-center shadow-[0_36px_70px_-38px_var(--inchiostro)] ring-1 ring-border/40 sm:px-14"
          >
            <CompassRose className="pointer-events-none absolute right-6 top-6 size-12 opacity-[0.08]" />
            <span
              aria-hidden="true"
              className={cn("font-serif text-5xl italic sm:text-6xl", accent)}
            >
              {numeral}
            </span>
            <InkReveal
              as="h3"
              text={t(`cards.${key}.title`)}
              className="mt-6 max-w-2xl text-3xl leading-tight sm:text-[2.6rem]"
            />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-salvia">
              {t(`cards.${key}.body`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
