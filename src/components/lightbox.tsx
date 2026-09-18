"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
}

const MORPH = { type: "spring" as const, stiffness: 260, damping: 30 };

const SWIPE_DISTANCE = 70;
const SWIPE_VELOCITY = 380;

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

  const [hiResSrc, setHiResSrc] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const draggedAt = useRef(0);
  const reduced = useReducedMotion();

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const img = images[current];

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

            if (Date.now() - draggedAt.current < 250) return;

            if (e.target === overlayRef.current) onClose();
          }}
        >

          <motion.div
            className="absolute inset-0 bg-carta/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.div
            className="relative z-10 h-[85vh] w-[90vw]"
            drag={reduced || images.length < 2 ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              draggedAt.current = Date.now();

              const passa =
                Math.abs(info.offset.x) > SWIPE_DISTANCE ||
                Math.abs(info.velocity.x) > SWIPE_VELOCITY;
              if (passa) go(info.offset.x < 0 ? 1 : -1);
            }}
          >

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={img.src}
                layoutId={morphing ? `${layoutIdPrefix}-${img.src}` : undefined}
                className="absolute inset-0"
                style={{ willChange: "transform" }}
                custom={direction}
                initial={morphing ? false : { opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={morphing ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
                transition={morphing ? MORPH : { duration: 0.22 }}
              >

                <Image
                  src={img.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  draggable={false}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-2xl object-contain shadow-[0_30px_80px_-30px_var(--blu-scuro)]"
                />

                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  draggable={false}
                  sizes="90vw"
                  onLoad={() => setHiResSrc(img.src)}
                  className={cn(
                    "rounded-2xl object-contain transition-opacity duration-300",
                    hiResSrc === img.src ? "opacity-100" : "opacity-0",
                  )}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {img.alt ? (
            <motion.p
              className="absolute bottom-6 left-1/2 z-10 max-w-lg -translate-x-1/2 text-center text-sm text-blu-testo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
            >
              {img.alt}
            </motion.p>
          ) : null}

          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="absolute right-4 top-4 z-10 size-10 coarse:size-12 rounded-full border border-border/60 bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
              <path d="M 6 6 L 18 18 M 18 6 L 6 18" />
            </svg>
          </button>

          {images.length > 1 ? (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Precedente"
                className="absolute left-4 top-1/2 z-10 size-10 coarse:size-12 -translate-y-1/2 rounded-full border border-border/60 bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
                  <path d="M 15 6 L 9 12 L 15 18" />
                </svg>
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Successiva"
                className="absolute right-4 top-1/2 z-10 size-10 coarse:size-12 -translate-y-1/2 rounded-full border border-border/60 bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-card"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto size-5">
                  <path d="M 9 6 L 15 12 L 9 18" />
                </svg>
              </button>

              <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 text-xs font-medium text-blu-testo/70">
                {current + 1} / {images.length}
              </span>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
