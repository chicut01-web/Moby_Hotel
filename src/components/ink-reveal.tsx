"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Rete di sicurezza: oltre questa soglia il titolo compare comunque. */
const SAFETY_MS = 1200;

/**
 * Titolo che "si scrive" a inchiostro, parola per parola, quando entra in
 * viewport: ogni parola sale a fuoco (blur + salita) su una molla, in
 * cascata. Una sola volta.
 *
 * Come <Reveal/>: osservatore esplicito + timeout di sicurezza, perché
 * `whileInView` non scatta in modo affidabile per nodi montati durante
 * una navigazione client-side e lascerebbe titoli invisibili.
 *
 * `as` sceglie il tag (default h2); `startDelay` ritarda la cascata iniziale;
 * `stagger` è il ritardo tra una parola e l'altra (ms).
 */
export function InkReveal({
  text,
  as,
  className,
  startDelay = 0,
  stagger = 90,
  wordClassName,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  startDelay?: number;
  stagger?: number;
  wordClassName?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setShown(true);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    const safety = window.setTimeout(show, SAFETY_MS);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  const Tag = (as ?? "h2") as ElementType;
  const words = text.split(" ");

  if (reduced) return <Tag className={cn(className)}>{text}</Tag>;

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((word, i) => (
        // Lo spazio sta FUORI dallo span animato: dentro un inline-block
        // il whitespace finale viene troncato e le parole si attaccano.
        <span key={`${word}-${i}`}>
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ opacity: 0, y: 14, filter: "blur(7px)" }}
            animate={
              shown ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
            }
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 20,
              mass: 0.7,
              delay: (startDelay + i * stagger) / 1000,
            }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </Tag>
  );
}
