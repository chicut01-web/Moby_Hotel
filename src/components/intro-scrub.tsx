"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const STEPS = ["monti", "chiostro", "porta"] as const;

/* Media query come external store: funzioni stabili a livello modulo,
   così useSyncExternalStore non risottoscrive a ogni render. */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Il volo sul convento come apertura della home, governato dallo scroll:
 * la sezione si aggancia e lo scroll manda avanti e indietro il video,
 * con un filo di smorzamento che ammorbidisce gli scatti della rotella;
 * tre scritte si alternano sul filmato. Con prefers-reduced-motion
 * niente scrub: poster fermo e la scritta di benvenuto.
 *
 * Un file solo per tutti (1080p, CRF 28, 3.9MB): a parità di peso la
 * risoluzione piena batte una versione ridotta per mobile — misurata
 * somiglianza 0.984 al master, differenza non percepibile — e sparisce
 * il ramo per dispositivo.
 */
const VIDEO_SRC = "/videos/convento-intro-scrub.mp4";
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
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let raf = 0;
    let progress = 0;
    let current = -1; // tempo-video inseguitore; -1 = da inizializzare
    let lastTick = 0;

    // Morbidezza su base TEMPO, non per-frame: la stessa identica
    // sensazione a 60, 120 o 144Hz. TAU è la costante di tempo dello
    // smorzamento esponenziale — l'unico numero da girare: più alto =
    // più morbido e pigro, più basso = più secco (90ms ≈ il video si
    // posa in circa un quarto di secondo).
    const TAU_MS = 90;
    // Quanto restare indietro dal bordo del buffer: un seek che atterra
    // esattamente sull'ultimo fotogramma scaricato resta appeso in
    // attesa del chunk dopo.
    const SAFE_MARGIN = 0.25;

    /**
     * Fine del tratto scaricato **di seguito dall'inizio**, non della
     * porzione più avanzata. È la distinzione che conta: ogni seek apre
     * una richiesta a intervalli e spezza il buffer in isole tipo
     * `[0-1.2][3.5-4.2]`. Leggere la fine dell'ultima isola (4.2) fa
     * credere disponibile anche il buco in mezzo: il video ci si infila,
     * il seek non si completa mai e l'immagine resta congelata. Con
     * `preload="auto"` il download procede in ordine, quindi il tratto
     * che parte da zero è l'unico di cui fidarsi.
     */
    const contiguousEnd = () => {
      const b = video.buffered;
      for (let i = 0; i < b.length; i++) {
        if (b.start(i) <= 0.1) return b.end(i);
      }
      return 0;
    };

    // Un solo seek per volta: assegnare `currentTime` mentre il decoder
    // sta ancora lavorando annulla il seek precedente, e a 60fps significa
    // annullarlo per sempre — immagine ferma mentre `seeking` resta vero.
    // Il prossimo parte quando il decoder ha finito, verso il target di
    // quel momento: si autoregola alla velocità reale della macchina.
    let seekPending = false;
    const onSeeked = () => {
      seekPending = false;
    };
    video.addEventListener("seeked", onSeeked);

    const tick = (now: number) => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        // Rete di sicurezza se `seeked` sfugge (succede su alcuni
        // browser quando il seek finisce dove eravamo già).
        if (seekPending && !video.seeking) seekPending = false;

        let target = progress * (d - 0.05);

        // MAI chiedere fotogrammi non ancora scaricati. Se la rete è
        // indietro il video si posa sull'ultimo fotogramma sicuro e
        // riprende da solo appena il buffer cresce (il loop resta acceso).
        const safeEnd = Math.max(0, contiguousEnd() - SAFE_MARGIN);
        const waitingOnBuffer = target > safeEnd;
        if (waitingOnBuffer) target = safeEnd;

        if (current < 0) current = video.currentTime;
        const dt = lastTick ? Math.min(now - lastTick, 100) : 16.7;
        current += (target - current) * (1 - Math.exp(-dt / TAU_MS));

        if (!seekPending && Math.abs(video.currentTime - current) > 0.02) {
          seekPending = true;
          video.currentTime = current;
        }

        // Il loop resta acceso finché non ha raggiunto il punto voluto
        // o finché sta aspettando rete; poi si spegne e riparte al
        // prossimo scroll.
        if (Math.abs(target - current) > 0.008 || waitingOnBuffer) {
          lastTick = now;
          raf = requestAnimationFrame(tick);
          return;
        }
        current = target;
        if (!seekPending) {
          seekPending = true;
          video.currentTime = target;
        }
      }
      lastTick = 0;
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
      video.removeEventListener("seeked", onSeeked);
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
          src={VIDEO_SRC}
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
