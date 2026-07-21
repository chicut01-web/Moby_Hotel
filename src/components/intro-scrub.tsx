"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const STEPS = ["monti", "chiostro", "porta"] as const;

/* Media query come external store: funzioni stabili a livello modulo,
   così useSyncExternalStore non risottoscrive a ogni render. */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 768px)";

function makeSubscribe(query: string) {
  return (onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
}
const subscribeReduced = makeSubscribe(REDUCED_QUERY);
const subscribeMobile = makeSubscribe(MOBILE_QUERY);
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getMobile = () => window.matchMedia(MOBILE_QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Il volo sul convento come apertura della home, governato dallo scroll:
 * la sezione si aggancia e lo scroll manda avanti e indietro il video
 * (convento-intro-scrub.mp4, GOP corto perché il seek atterri entro
 * pochi fotogrammi), con un filo di smorzamento che ammorbidisce gli
 * scatti della rotella; tre scritte si alternano sul filmato. Con
 * prefers-reduced-motion niente scrub: poster fermo e la scritta di
 * benvenuto.
 */
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
  const mobile = useSyncExternalStore(
    subscribeMobile,
    getMobile,
    getServerSnapshot,
  );
  const src = mobile
    ? "/videos/convento-intro-scrub-540.mp4"
    : "/videos/convento-intro-scrub.mp4";

  /**
   * Il video compare solo quando ha davvero dei fotogrammi da mostrare
   * (`loadeddata`); prima resta il poster di fondo. Scaricarlo tutto in
   * memoria come blob sembrava la mossa giusta — seek sempre immediati —
   * ma è tutto-o-niente: su una connessione lenta lo scroll non muove
   * nulla finché non è finito. Meglio il caricamento progressivo, con un
   * file abbastanza leggero da riempirsi in fretta.
   */
  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) {
      setReady(true);
      return;
    }
    const onLoaded = () => setReady(true);
    video.addEventListener("loadeddata", onLoaded);
    return () => video.removeEventListener("loadeddata", onLoaded);
  }, [reduced, src]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let raf = 0;
    let progress = 0;
    let current = -1; // tempo-video inseguitore; -1 = da inizializzare

    // Il video insegue lo scroll con un filo di smorzamento: quanto
    // basta ad ammorbidire gli scatti della rotella senza arrancare
    // dietro al dito. CATCH_UP è la frazione di distanza recuperata a
    // ogni frame — più basso è più morbido (0.16 risultava lento),
    // più alto è più secco (1 = aggancio rigido). Su spostamenti ampi
    // recupera quasi tutto subito, così uno scroll deciso non accumula
    // ritardo.
    const CATCH_UP = 0.45;
    const CATCH_UP_FAST = 0.8;
    const FAST_THRESHOLD = 0.35; // secondi di video

    const tick = () => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        const target = progress * (d - 0.05);
        if (current < 0) current = video.currentTime;
        const delta = target - current;
        current +=
          delta * (Math.abs(delta) > FAST_THRESHOLD ? CATCH_UP_FAST : CATCH_UP);
        // Sotto un fotogramma non riposizioniamo: seek inutili in meno.
        if (Math.abs(video.currentTime - current) > 0.02) {
          video.currentTime = current;
        }
        // Finché non ha raggiunto il target il loop continua; poi si
        // spegne e riparte al prossimo scroll.
        if (Math.abs(target - current) > 0.008) {
          raf = requestAnimationFrame(tick);
          return;
        }
        current = target;
        video.currentTime = target;
      }
      raf = 0;
    };

    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progress = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setStage(progress < 0.36 ? 0 : progress < 0.7 ? 1 : 2);
      // Ultimo 10%: la home emerge dal volo (overlay calce via --exit).
      const exit = progress > 0.9 ? (progress - 0.9) / 0.1 : 0;
      section.style.setProperty("--exit", exit.toFixed(3));
      if (!raf) raf = requestAnimationFrame(tick);
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
      <div
        className="sticky top-0 h-dvh overflow-hidden bg-inchiostro bg-cover bg-center"
        // Il poster fa da fondo permanente: se il video non è ancora
        // pronto — o viene rimontato tornando sulla home — la scena
        // resta comunque quella giusta, mai uno schermo vuoto.
        style={{ backgroundImage: "url(/videos/convento-intro-poster.jpg)" }}
      >
        <video
          ref={videoRef}
          src={src}
          poster="/videos/convento-intro-poster.jpg"
          muted
          playsInline
          // Scarica subito e in sequenza: così il buffer cresce da solo
          // invece di frammentarsi in una range request per ogni seek.
          preload="auto"
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            ready ? "opacity-100" : "opacity-0",
          )}
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
        {/* Uscita: la home emerge dal volo, niente taglio netto */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-calce"
          style={{ opacity: "var(--exit, 0)" }}
        />
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
