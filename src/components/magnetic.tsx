"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const MAX_PULL = 6; // px massimi di attrazione verso il cursore

/**
 * Avvolge un elemento e lo attira leggermente verso il cursore (effetto
 * "magnetico"). Pensato per CTA e link d'azione. Solo puntatori fini e
 * senza prefers-reduced-motion. Si compone con qualsiasi contenuto.
 */
export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

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
    // Smorza ai bordi del range [-1,1] per un attrazione naturale.
    const pull = (n: number) => Math.max(-1, Math.min(1, n)) * MAX_PULL;
    el.style.transform = `translate(${pull(dx).toFixed(2)}px, ${pull(dy).toFixed(2)}px)`;
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("inline-block transition-transform duration-200 ease-out", className)}
      style={{ willChange: "transform" }}
    >
      {children}
    </span>
  );
}
