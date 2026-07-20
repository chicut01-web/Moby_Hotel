"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

const MAX_PULL = 6; // px massimi di attrazione verso il cursore
const PULL_SPRING = { stiffness: 260, damping: 16, mass: 0.5 };

/**
 * Avvolge un elemento e lo attira leggermente verso il cursore (effetto
 * "magnetico"), con molla Motion: al rilascio scatta indietro invece di
 * tornare linearmente. Pensato per CTA e link d'azione. Solo puntatori
 * fini e senza prefers-reduced-motion.
 */
export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), PULL_SPRING);
  const y = useSpring(useMotionValue(0), PULL_SPRING);

  const isEnabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onPointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || !isEnabled()) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Smorza ai bordi del range [-1,1] per un'attrazione naturale.
    const pull = (n: number) => Math.max(-1, Math.min(1, n)) * MAX_PULL;
    x.set(pull(dx));
    y.set(pull(dy));
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("inline-block", className)}
      style={{ x, y, willChange: "transform" }}
    >
      {children}
    </motion.span>
  );
}
