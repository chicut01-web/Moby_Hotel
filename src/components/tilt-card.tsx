"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

const MAX_TILT = 4; // gradi
const TILT_SPRING = { stiffness: 220, damping: 18, mass: 0.6 };

/**
 * Inclina leggermente il contenuto verso il cursore (effetto 3D discreto).
 * Rotazione e riflesso passano da molle Motion: il ritorno a riposo è
 * elastico invece che una transizione lineare. Solo puntatori fini; con
 * prefers-reduced-motion non fa nulla.
 */
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), TILT_SPRING);
  const rotateY = useSpring(useMotionValue(0), TILT_SPRING);
  const glareX = useSpring(useMotionValue(50), TILT_SPRING);
  const glareY = useSpring(useMotionValue(50), TILT_SPRING);
  // Il gradiente segue il cursore con la stessa molla della rotazione.
  const glare = useMotionTemplate`radial-gradient(180px circle at ${glareX}% ${glareY}%, rgba(255,248,234,0.22), transparent 60%)`;

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
    rotateX.set(-py * MAX_TILT);
    rotateY.set(px * MAX_TILT);
    glareX.set((px + 0.5) * 100);
    glareY.set((py + 0.5) * 100);
  }

  function onPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("tilt-card group/tilt relative", className)}
      style={{
        transformStyle: "preserve-3d",
        perspective: 900,
        rotateX,
        rotateY,
      }}
    >
      {children}
      {/* Riflesso di luce radiale che segue il cursore sulla "tela" inclinata */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{ background: glare, mixBlendMode: "soft-light" }}
      />
    </motion.div>
  );
}
