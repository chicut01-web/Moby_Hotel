"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { OceanWaves } from "@/components/ocean-waves";
import { Clouds } from "@/components/clouds";
import { InkReveal } from "@/components/ink-reveal";
import { cn } from "@/lib/utils";

const LEGS = [
  { key: "rotta", num: "01", accent: "text-cotto", ring: "border-cotto/50" },
  { key: "orizzonti", num: "02", accent: "text-salvia", ring: "border-salvia/50" },
  { key: "persone", num: "03", accent: "text-tramonto", ring: "border-tramonto/50" },
] as const;

/**
 * Rotta che serpeggia lungo i tre "porti" della traversata (0–3000 × 0–800).
 * Termina al largo della terza scritta (2940,525), dove vanno a riposare
 * anche il terzo porto, la fine dell'inchiostro e la barchetta.
 * Unica fonte di verità: guida tratteggiata, tratto inchiostrato e
 * navigazione della barca leggono tutti da qui.
 */
const ROUTE_D =
  "M -40 560 C 260 420 420 300 640 340 C 860 380 980 560 1240 560 C 1500 560 1600 300 1860 280 C 2120 260 2300 460 2480 500 C 2610 530 2780 545 2940 525";

/** Molla condivisa della traversata: plana, non scatta. */
const SAIL_SPRING = { stiffness: 90, damping: 26, restDelta: 0.001 };

/**
 * Il manifesto come traversata: la sezione si "aggancia" (sticky CSS) e
 * lo scroll verticale diventa navigazione orizzontale lungo una carta
 * nautica. Lo scrub è guidato da Motion (useScroll + useSpring): gira in
 * ogni browser — Firefox compreso — e tutta la scena plana con inerzia.
 * Binario, inchiostro della rotta e barchetta completano all'82% e
 * sostano sul terzo porto; lo sfondo di costa scorre a metà velocità
 * (parallasse). Heave/pitch della barca restano keyframes CSS
 * time-based. Con prefers-reduced-motion: racconto verticale statico.
 */
export function ManifestoVoyage() {
  const t = useTranslations("home.manifesto");
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const guideRef = useRef<SVGPathElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, SAIL_SPRING);

  const trackX = useTransform(p, [0, 0.82, 1], ["0vw", "-200vw", "-200vw"]);
  const farX = useTransform(p, [0, 0.82, 1], ["0vw", "-100vw", "-100vw"]);
  const inkLength = useTransform(p, [0, 0.82], [0, 1]);

  /**
   * La barchetta naviga la rotta, ma **fuori** dall'SVG.
   *
   * La carta nautica è disegnata in 3000×800 e stirata sul binario con
   * `preserveAspectRatio="none"`: le due scale sono diverse, e su schermi
   * stretti diversissime — misurate 1.47×1.04 su desktop contro
   * 0.39×1.06 su telefono. Qualunque cosa viva dentro quell'SVG eredita
   * lo schiacciamento: la barca finiva larga un quarto del dovuto, una
   * scheggia verticale, con la prua puntata dove la linea visibile non
   * andava.
   *
   * `getCTM()` dà la matrice completa dal tracciato ai pixel dell'SVG:
   * ci sono dentro il viewBox **e** l'appiattimento che la rotta riceve
   * su mobile. Punto e angolo escono da lì, quindi la barca segue la
   * linea come la si vede, qualunque trasformazione le venga applicata —
   * senza doverla replicare qui.
   */
  useEffect(() => {
    if (reduced) return;
    const svg = svgRef.current;
    const guide = guideRef.current;
    const boat = boatRef.current;
    if (!svg || !guide || !boat) return;

    let lunghezza = guide.getTotalLength();
    let ctm = guide.getCTM();

    const misura = () => {
      lunghezza = guide.getTotalLength();
      ctm = guide.getCTM();
    };

    const posiziona = (v: number) => {
      if (!ctm) return;
      // La barca completa la traversata all'82%, come binario e inchiostro.
      const avanzamento = Math.min(1, Math.max(0, v / 0.82));
      const d = lunghezza * avanzamento;
      const qui = guide.getPointAtLength(d).matrixTransform(ctm);
      const poi = guide
        .getPointAtLength(Math.min(lunghezza, d + 2))
        .matrixTransform(ctm);
      const angolo =
        (Math.atan2(poi.y - qui.y, poi.x - qui.x) * 180) / Math.PI;
      boat.style.transform = `translate(${qui.x}px, ${qui.y}px) rotate(${angolo}deg)`;
    };

    misura();
    posiziona(p.get());

    const ro = new ResizeObserver(() => {
      misura();
      posiziona(p.get());
    });
    ro.observe(svg);
    const stop = p.on("change", posiziona);

    return () => {
      stop();
      ro.disconnect();
    };
  }, [p, reduced]);

  if (reduced) {
    return (
      <section aria-labelledby="manifesto-heading" className="py-16 sm:py-24">
        <div className="text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="manifesto-heading" className="sr-only">
            {t("title")}
          </h2>
        </div>
        <div className="mx-auto mt-4 max-w-3xl">
          {LEGS.map(({ key, num, accent, ring }) => (
            <article key={key} className="px-6 py-14">
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
              <h3 className="mt-6 text-3xl leading-tight sm:text-4xl">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-salvia">
                {t(`cards.${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="manifesto-heading"
      className="manifesto-voyage"
    >
      <div className="manifesto-pin bg-gradient-to-b from-salvia-soft/40 via-calce to-calce">
        <Clouds />

        {/* Strato lontano: costa a inchiostro a metà velocità = profondità */}
        <motion.div
          aria-hidden="true"
          className="manifesto-far"
          style={{ x: farX }}
        >
          <svg
            viewBox="0 0 2000 800"
            preserveAspectRatio="none"
            fill="none"
            className="h-full w-full"
          >
            <path
              d="M 0 620 Q 250 540 480 600 T 980 590 T 1500 610 T 2000 580 V 800 H 0 Z"
              fill="var(--inchiostro)"
              opacity="0.045"
            />
            <path
              d="M 0 680 Q 300 630 600 665 T 1200 660 T 2000 670 V 800 H 0 Z"
              fill="var(--salvia)"
              opacity="0.05"
            />
            {/* Una vela all'orizzonte */}
            <path
              d="M 1252 596 L 1252 574 L 1266 596 Z"
              fill="var(--inchiostro)"
              opacity="0.12"
            />
          </svg>
        </motion.div>

        <div className="manifesto-eyebrow relative z-10 pt-10 text-center">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="manifesto-heading" className="sr-only">
            {t("title")}
          </h2>
        </div>

        <motion.div className="manifesto-track" style={{ x: trackX }}>
          {/* Carta nautica: guida tratteggiata + tratto che si inchiostra */}
          <svg
            ref={svgRef}
            aria-hidden="true"
            viewBox="0 0 3000 800"
            preserveAspectRatio="none"
            fill="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {/* Rotta, inchiostro e porti in un gruppo solo: su schermi
                stretti riceve un appiattimento (globals.css) che li
                sposta sotto il testo e addolcisce le pendenze. */}
            <g className="manifesto-route">
              <path
                ref={guideRef}
                d={ROUTE_D}
                pathLength={1}
                stroke="var(--inchiostro)"
                strokeOpacity="0.16"
                strokeWidth="2"
                strokeDasharray="0.006 0.005"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={ROUTE_D}
                stroke="var(--salvia)"
                strokeOpacity="0.45"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: inkLength }}
              />
              {/* Porti di scalo sulla rotta */}
              <g stroke="var(--inchiostro)" strokeOpacity="0.35">
                <circle className="manifesto-port" cx="640" cy="340" r="7" fill="var(--cotto)" strokeWidth="6" strokeOpacity="0.12" />
                <circle className="manifesto-port" cx="1860" cy="280" r="7" fill="var(--salvia)" strokeWidth="6" strokeOpacity="0.12" />
                <circle className="manifesto-port" cx="2940" cy="525" r="7" fill="var(--tramonto)" strokeWidth="6" strokeOpacity="0.12" />
              </g>
            </g>
          </svg>

          {/* La barchetta: posizione e rotta arrivano dal tracciato qui
              sopra, ma il disegno vive fuori dall'SVG per non ereditarne
              lo schiacciamento. Si solleva (heave) e beccheggia (pitch)
              su periodi diversi, che si sfasano da soli. */}
          <div ref={boatRef} aria-hidden="true" className="manifesto-boat">
            <div className="manifesto-boat-heave">
              <div className="manifesto-boat-pitch">
                <svg viewBox="0 0 48 44" fill="currentColor" className="manifesto-boat-svg">
                  <path d="M 6 30 L 42 30 L 36 37 L 12 37 Z" opacity="0.85" />
                  <path d="M 24 6 L 24 30" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M 26 8 Q 38 18 26 28 Z" opacity="0.65" />
                  <path d="M 22 11 Q 12 19 22 28 Z" opacity="0.5" />
                  <path d="M 24 6 L 30 8 L 24 10 Z" />
                </svg>
              </div>
            </div>
          </div>

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
        </motion.div>

        <OceanWaves className="h-24" />
      </div>
    </section>
  );
}
