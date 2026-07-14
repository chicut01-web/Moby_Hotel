"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const SESSION_KEY = "intro-seen";
const START_TIMEOUT_MS = 3000; // se il video non parte entro, via l'overlay

/**
 * Intro a schermo intero: il volo nel chiostro fino alla porta socchiusa,
 * poi dissolvenza sulla home. Solo alla prima visita della sessione, muto,
 * saltabile; con prefers-reduced-motion o autoplay bloccato non appare/si
 * chiude subito.
 */
export function IntroVideo() {
  const t = useTranslations("intro");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"hidden" | "playing" | "fading">("hidden");

  useEffect(() => {
    if (
      sessionStorage.getItem(SESSION_KEY) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const raf = requestAnimationFrame(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("playing");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const video = videoRef.current;
    if (!video) return;

    // Se il video non è partito entro il timeout (rete lenta, autoplay
    // bloccato), non tenere il sito in ostaggio.
    const timeout = setTimeout(() => {
      if (video.currentTime === 0) setPhase("fading");
    }, START_TIMEOUT_MS);

    video.play().catch(() => setPhase("fading"));
    return () => clearTimeout(timeout);
  }, [phase]);

  // La dissolvenza si chiude con transitionend, ma se le transition non
  // girano (tab in background, ambienti headless) un timer di riserva
  // smonta comunque l'overlay.
  useEffect(() => {
    if (phase !== "fading") return;
    const fallback = setTimeout(() => setPhase("hidden"), 900);
    return () => clearTimeout(fallback);
  }, [phase]);

  if (phase === "hidden") return null;

  const dismiss = () => setPhase("fading");

  return (
    <div
      className="fixed inset-0 z-[100] bg-calce-deep transition-opacity duration-700"
      style={{ opacity: phase === "fading" ? 0 : 1 }}
      onTransitionEnd={() => {
        if (phase === "fading") setPhase("hidden");
      }}
      aria-hidden={phase === "fading"}
    >
      <video
        ref={videoRef}
        src="/videos/convento-intro.mp4"
        poster="/videos/convento-intro-poster.jpg"
        muted
        playsInline
        preload="auto"
        onEnded={dismiss}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-6 right-6 rounded-full border border-calce/40 bg-inchiostro/40 px-5 py-2 text-sm text-calce backdrop-blur transition-colors hover:bg-inchiostro/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calce"
      >
        {t("skip")}
      </button>
    </div>
  );
}
