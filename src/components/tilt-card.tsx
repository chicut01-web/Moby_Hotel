"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const MAX_TILT = 4; // gradi

/**
 * Inclina leggermente il contenuto verso il cursore (effetto 3D discreto).
 * Solo puntatori fini; con prefers-reduced-motion non fa nulla.
 */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isEnabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !isEnabled()) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) rotateY(${(px * MAX_TILT).toFixed(2)}deg)`;
    // Riflesso "glare" che segue il cursore (posizione in percentuale).
    el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "tilt-card group/tilt relative transition-transform duration-300 ease-out",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {/* Riflesso di luce radiale che segue il cursore sulla "tela" inclinata */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(255,248,234,0.22), transparent 60%)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
