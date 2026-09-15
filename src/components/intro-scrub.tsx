"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const STEPS = ["monti", "chiostro", "porta"] as const;

/* Media query come external store: funzioni stabili a livello modulo */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Apertura della home con video in loop continuo e tranquillo:
 * il video aereo scorre lentamente e dolcemente come nel girato originale
 * senza costringere l'utente a uno scroll forzato di 520vh.
 * Le tre scritte si alternano in sincronia col procedere del filmato.
 * Con prefers-reduced-motion niente riproduzione: poster fisso e benvenuto.
 */
const VIDEO_WIDE = "/videos/hey-intro.mp4";
const VIDEO_PORTRAIT = "/videos/hey-intro-mobile.mp4";
const PORTRAIT_QUERY = "(max-width: 767px) and (orientation: portrait)";

export function IntroScrub() {
  const t = useTranslations("intro");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getServerSnapshot,
  );

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    const mq = window.matchMedia(PORTRAIT_QUERY);
    const applySource = () => {
      const wanted = mq.matches ? VIDEO_PORTRAIT : VIDEO_WIDE;
      if (video.getAttribute("src") === wanted) return;
      const wasAt = video.currentTime;
      video.src = wanted;
      video.load();
      if (wasAt > 0) {
        const restore = () => {
          video.currentTime = wasAt;
          video.removeEventListener("loadedmetadata", restore);
        };
        video.addEventListener("loadedmetadata", restore);
      }
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback se bloccato da risparmio energetico
        });
      }
    };

    // Avvio progressivo: su desktop subito, su mobile dopo primo tocco/scroll o load
    const segnali = ["wheel", "touchstart", "scroll", "keydown"] as const;
    let avviato = false;
    const smettiDiAspettare = () => {
      segnali.forEach((s) => window.removeEventListener(s, avvia));
      window.removeEventListener("load", avvia);
    };
    function avvia() {
      if (avviato) return;
      avviato = true;
      smettiDiAspettare();
      applySource();
    }

    if (!mq.matches) {
      avvia();
    } else {
      segnali.forEach((s) =>
        window.addEventListener(s, avvia, { passive: true }),
      );
      if (document.readyState === "complete") avvia();
      else window.addEventListener("load", avvia);
      if (window.scrollY > 0) avvia();
    }
    mq.addEventListener("change", applySource);

    const onCanPlay = () => {
      setReady(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    if (video.readyState >= 2) {
      setReady(true);
      video.play().catch(() => {});
    } else {
      video.addEventListener("loadeddata", onCanPlay);
      video.addEventListener("canplay", onCanPlay);
    }

    // Le tre scritte si alternano in sincronia col minutaggio del filmato (13.25s)
    const onTimeUpdate = () => {
      const duration = video.duration || 13.25;
      const current = video.currentTime;
      const ratio = duration > 0 ? current / duration : 0;
      if (ratio < 0.35) {
        setStage(0);
      } else if (ratio < 0.7) {
        setStage(1);
      } else {
        setStage(2);
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      smettiDiAspettare();
      mq.removeEventListener("change", applySource);
      video.removeEventListener("loadeddata", onCanPlay);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [reduced]);

  const scrollToHero = () => {
    const nextSection = sectionRef.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  if (reduced) {
    return (
      <section className="relative h-[72vh] overflow-hidden">
        <Image
          src="/videos/hey-intro-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-blu-scuro/80 via-blu-scuro/10 to-blu-scuro/25"
        />
        <p className="intro-scrub-step is-active">{t("steps.porta")}</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="intro-scrub relative h-dvh w-full overflow-hidden bg-blu-scuro"
    >
      <div className="relative h-full w-full overflow-hidden">
        {/* Poster di fondo per caricamento immediato */}
        <picture className="pointer-events-none absolute inset-0 h-full w-full">
          <source
            media="(max-width: 767px) and (orientation: portrait)"
            srcSet="/videos/hey-intro-poster-mobile.jpg"
          />
          <img
            src="/videos/hey-intro-poster.jpg"
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>

        {/* Video in loop tranquillo a riproduzione automatica e silenziosa */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Video introduttivo del convento"
          className={cn(
            "relative h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <track
            kind="captions"
            src="/captions/empty.vtt"
            srcLang="it"
            label="Senza audio"
            default
          />
        </video>

        {/* Sfumatura cinematografica per far risaltare il testo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blu-scuro/85 via-blu-scuro/15 to-blu-scuro/30"
        />

        {/* I 3 testi si alternano dolcemente col procedere del filmato */}
        {STEPS.map((key, i) => (
          <p
            key={key}
            className={cn(
              "intro-scrub-step whitespace-pre-line",
              stage === i && "is-active",
            )}
          >
            {t(`steps.${key}`)}
          </p>
        ))}

        {/* Pulsante scorri per scendere subito all'hero con la foto del chiostro */}
        <button
          type="button"
          onClick={scrollToHero}
          aria-label={t("scrollHint")}
          className="intro-scrub-hint group cursor-pointer border-none bg-transparent focus:outline-none"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em] transition-colors group-hover:text-white">
            {t("scrollHint")}
          </span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="size-4 transition-transform group-hover:translate-y-0.5"
          >
            <path
              d="M 3 6 L 8 11 L 13 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
