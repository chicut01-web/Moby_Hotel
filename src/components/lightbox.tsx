"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
}

/** Molla del morph griglia ↔ schermo pieno: apre deciso, si posa morbido. */
const MORPH = { type: "spring" as const, stiffness: 260, damping: 30 };

/**
 * Overlay lightbox per gallerie: l'immagine cliccata **cresce dalla
 * miniatura** fino a schermo pieno e ci ritorna alla chiusura (Motion
 * layoutId condiviso con la griglia), su sfondo calce sfumato.
 * Navigazione con frecce (crossfade direzionale, senza morph: quello
 * vale solo griglia↔fullscreen), chiusura Escape o click sul fondo.
 * Accessibile: dialog modale, aria-label, blocco dello scroll.
 * Con prefers-reduced-motion niente morph, solo comparsa immediata.
 */
export function Lightbox({
  images,
  initial = 0,
  open,
  onClose,
  layoutIdPrefix = "gallery",
}: {
  images: LightboxImage[];
  initial?: number;
  open: boolean;
  onClose: () => void;
  layoutIdPrefix?: string;
}) {
  const [current, setCurrent] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  const [direction, setDirection] = useState(0);
  // src dell'alta risoluzione già caricata: finché non arriva resta
  // visibile il layer con la stessa risorsa della miniatura.
  const [hiResSrc, setHiResSrc] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Sync indice iniziale durante il render (pattern React "derived state"):
  // se initial cambia mentre siamo chiusi, il prossimo render è già giusto.
  if (!open && prevInitial !== initial) {
    setPrevInitial(initial);
    setCurrent(initial);
  }

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setCurrent((i) => (i + step + images.length) % images.length);
    },
    [images.length],
  );

  // Chiudi con Escape; naviga con frecce.
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    },
    [open, onClose, go],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Blocca scroll del body quando è aperto.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const img = images[current];
  // Il morph vale solo per la foto da cui si è aperto: sfogliando con le
  // frecce si passa al crossfade, altrimenti il layout salterebbe verso
  // miniature diverse.
  const morphing = !reduced && current === prevInitial;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={img.alt}
          className="fixed inset-0 z-[80] flex items-center justify-center"
          onClick={(e) => {
            // Chiudi solo se si clicca il fondo (non l'immagine).
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Sfondo calce quasi pieno. NIENTE backdrop-blur: sfocare
              l'intero sfondo (dove le animazioni ambient non si fermano
              mai) va rifatto a ogni frame e costava un terzo dei
              fotogrammi dell'apertura — misurati 44fps contro 61. */}
          <motion.div
            className="absolute inset-0 bg-calce/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Immagine: cresce dalla miniatura (layoutId condiviso) */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={img.src}
              layoutId={morphing ? `${layoutIdPrefix}-${img.src}` : undefined}
              className="relative z-10 h-[85vh] w-[90vw]"
              style={{ willChange: "transform" }}
              custom={direction}
              initial={morphing ? false : { opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={morphing ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
              transition={morphing ? MORPH : { duration: 0.22 }}
            >
              {/* Base: la STESSA risorsa della miniatura (sizes identiche
                  alla griglia → stessa URL, già in cache HTTP). Il morph
                  ha pixel veri dal primo frame anche a cache fredda,
                  mentre l'alta risoluzione arriva dalla rete. */}
              <Image
                src={img.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-2xl object-contain shadow-[0_30px_80px_-30px_var(--inchiostro)]"
              />
              {/* Alta risoluzione: entra in dissolvenza quando è pronta */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="90vw"
                onLoad={() => setHiResSrc(img.src)}
                className={cn(
                  "rounded-2xl object-contain transition-opacity duration-300",
                  hiResSrc === img.src ? "opacity-100" : "opacity-0",
                )}
              />
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          {img.alt ? (
            <motion.p
              className="absolute bottom-6 left-1/2 z-10 max-w-lg -translate-x-1/2 text-center text-sm text-pietra"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
            >
              {img.alt}
            </motion.p>
          ) : null}

          {/* Bottone chiudi */}
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="absolute right-4 top-4 z-10 size-10 rounded-full border border-border/60 bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
              <path d="M 6 6 L 18 18 M 18 6 L 6 18" />
            </svg>
          </button>

          {/* Frecce — solo se più di un'immagine */}
          {images.length > 1 ? (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Precedente"
                className="absolute left-4 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-border/60 bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
                  <path d="M 15 6 L 9 12 L 15 18" />
                </svg>
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Successiva"
                className="absolute right-4 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-border/60 bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
                  <path d="M 9 6 L 15 12 L 9 18" />
                </svg>
              </button>

              {/* Contatore */}
              <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-xs font-medium text-pietra/70">
                {current + 1} / {images.length}
              </span>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
