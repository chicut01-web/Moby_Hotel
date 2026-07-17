"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const STEPS = ["monti", "chiostro", "porta"] as const;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/**
 * Il volo sul convento come apertura della home, governato dallo scroll:
 * la sezione si aggancia e lo scroll manda avanti e indietro il video
 * (codifica all-keyframe in convento-intro-scrub.mp4, così il seek è
 * fluido), mentre tre scritte si alternano sul filmato. Con
 * prefers-reduced-motion niente scrub: poster fermo e la scritta di
 * benvenuto.
 */
export function IntroScrub() {
  const t = useTranslations("intro");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let raf = 0;
    let progress = 0;

    const seek = () => {
      raf = 0;
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        const target = progress * (d - 0.05);
        // Sotto un frame di distanza non riposizioniamo: meno seek, più fluido.
        if (Math.abs(video.currentTime - target) > 0.03) {
          video.currentTime = target;
        }
      }
    };

    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progress = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setStage(progress < 0.36 ? 0 : progress < 0.7 ? 1 : 2);
      if (!raf) raf = requestAnimationFrame(seek);
    };

    // Prima lettura al frame successivo: niente setState sincrono
    // nel corpo dell'effect.
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section className="relative h-[72vh] overflow-hidden">
        <Image
          src="/videos/convento-intro-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-inchiostro/50 via-transparent to-inchiostro/20"
        />
        <p className="intro-scrub-step is-active">{t("steps.porta")}</p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="intro-scrub relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/convento-intro-scrub.mp4"
          poster="/videos/convento-intro-poster.jpg"
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-inchiostro/50 via-transparent to-inchiostro/20"
        />
        {STEPS.map((key, i) => (
          <p
            key={key}
            className={cn("intro-scrub-step", stage === i && "is-active")}
          >
            {t(`steps.${key}`)}
          </p>
        ))}
        <div
          aria-hidden="true"
          className={cn(
            "intro-scrub-hint",
            stage === 0 ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">
            {t("scrollHint")}
          </span>
          <svg viewBox="0 0 16 16" fill="none" className="size-4">
            <path
              d="M 3 6 L 8 11 L 13 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
