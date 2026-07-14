"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
}

/**
 * Overlay lightbox per gallerie: mostra l'immagine cliccata a schermo pieno
 * con sfondo calce/inchiostro, navigazione con frecce e chiusura Escape/click.
 * Le immagini scorrono in circolo. Accessibile: focus trap e aria-label.
 */
export function Lightbox({
  images,
  initial = 0,
  open,
  onClose,
}: {
  images: LightboxImage[];
  initial?: number;
  open: boolean;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync indice iniziale durante il render (pattern React "derived state"):
  // se initial cambia mentre siamo chiusi, il prossimo render è già giusto.
  if (!open && prevInitial !== initial) {
    setPrevInitial(initial);
    setCurrent(initial);
  }

  // Chiudi con Escape; naviga con frecce.
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setCurrent((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setCurrent((i) => (i - 1 + images.length) % images.length);
    },
    [open, onClose, images.length],
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

  if (!open) return null;

  const img = images[current];

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      className="lightbox-overlay fixed inset-0 z-[80] flex items-center justify-center"
      onClick={(e) => {
        // Chiudi solo se si clicca il fondo (non l'immagine).
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Sfondo semi-trasparente calce */}
      <div className="absolute inset-0 bg-calce/90 backdrop-blur-sm" />

      {/* Immagine */}
      <div className={cn(
        "relative z-10 max-h-[85vh] max-w-[90vw]",
        "transition-opacity duration-200",
      )}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="90vw"
          className="object-contain rounded-2xl shadow-[0_30px_80px_-30px_var(--inchiostro)]"
        />
      </div>

      {/* Caption */}
      {img.alt && (
        <p className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 max-w-lg text-center text-sm text-pietra">
          {img.alt}
        </p>
      )}

      {/* Bottone chiudi */}
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute top-4 right-4 z-10 size-10 rounded-full border border-border/60 bg-card/80 backdrop-blur transition-colors hover:bg-card text-foreground"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
          <path d="M 6 6 L 18 18 M 18 6 L 6 18" />
        </svg>
      </button>

      {/* Frecce — solo se più di un'immagine */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((i) => (i - 1 + images.length) % images.length)
            }
            aria-label="Precedente"
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 size-10 rounded-full border border-border/60 bg-card/80 backdrop-blur transition-colors hover:bg-card text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
              <path d="M 15 6 L 9 12 L 15 18" />
            </svg>
          </button>
          <button
            onClick={() =>
              setCurrent((i) => (i + 1) % images.length)
            }
            aria-label="Successiva"
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 size-10 rounded-full border border-border/60 bg-card/80 backdrop-blur transition-colors hover:bg-card text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
              <path d="M 9 6 L 15 12 L 9 18" />
            </svg>
          </button>
        </>
      )}

      {/* Contatore */}
      {images.length > 1 && (
        <span className="absolute top-5 left-1/2 z-10 -translate-x-1/2 text-xs font-medium text-pietra/70">
          {current + 1} / {images.length}
        </span>
      )}
    </div>
  );
}
