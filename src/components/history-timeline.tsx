"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { InkReveal } from "@/components/ink-reveal";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "fondazione", accent: "text-cotto", dot: "bg-cotto" },
  { key: "vita", accent: "text-salvia", dot: "bg-salvia" },
  { key: "terremoto", accent: "text-tramonto", dot: "bg-tramonto" },
  { key: "recupero", accent: "text-salvia", dot: "bg-salvia" },
  { key: "oggi", accent: "text-cotto", dot: "bg-cotto" },
] as const;

/**
 * La storia del convento come linea del tempo: una rotta verticale
 * tratteggiata che si inchiostra mentre scorri (Motion: useScroll +
 * useSpring sul blocco delle tappe, quindi cross-browser e con la
 * stessa inerzia della traversata), con le cinque tappe rivelate in
 * cascata. Con prefers-reduced-motion la rotta è già tutta inchiostrata
 * e non si muove nulla.
 */
export function HistoryTimeline() {
  const t = useTranslations("convento.timeline");
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });
  const inkLength = useTransform(p, [0, 1], [0, 1]);

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <InkReveal text={t("title")} className="mt-3 text-3xl sm:text-4xl" />
        </Reveal>

        <div ref={listRef} className="relative mt-12">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 1000"
            preserveAspectRatio="none"
            fill="none"
            className="absolute left-0 top-0 h-full w-6"
          >
            <path
              d="M 12 6 V 994"
              pathLength={1}
              stroke="var(--inchiostro)"
              strokeOpacity="0.15"
              strokeWidth="2"
              strokeDasharray="0.018 0.013"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d="M 12 6 V 994"
              stroke="var(--salvia)"
              strokeOpacity="0.5"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduced ? 1 : inkLength }}
            />
          </svg>

          <ol className="space-y-12">
            {STAGES.map(({ key, accent, dot }, i) => (
              <li key={key} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[6px] top-2.5 size-3 rounded-full ring-4 ring-calce",
                    dot,
                  )}
                />
                <Reveal delay={i * 90}>
                  <p
                    className={cn(
                      "font-serif text-2xl italic sm:text-3xl",
                      accent,
                    )}
                  >
                    {t(`items.${key}.era`)}
                  </p>
                  <h3 className="mt-1 text-xl">{t(`items.${key}.title`)}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {t(`items.${key}.body`)}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
