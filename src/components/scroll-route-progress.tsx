"use client";

import { useEffect, useRef } from "react";
import { SailboatIcon } from "@/components/sailboat";

/**
 * Indicatore di scorrimento in cima alla pagina: una rotta tratteggiata che
 * si disegna man mano che scorri, con una navicella sulla punta. rAF-throttled.
 */
export function ScrollRouteProgress() {
  const lineRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Barra statica senza nave: il progresso resta utile, niente moto extra.
      const update = () => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        if (lineRef.current)
          lineRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      return () => window.removeEventListener("scroll", update);
    }

    let raf = 0;
    let pending = false;
    const update = () => {
      pending = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const pct = (p * 100).toFixed(2);
      if (lineRef.current) lineRef.current.style.width = `${pct}%`;
      if (shipRef.current)
        shipRef.current.style.left = `calc(${pct}% - 12px)`;
    };
    const onScroll = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-6"
    >
      {/* rotta tratteggiata percorsa */}
      <div
        ref={lineRef}
        className="absolute left-0 top-[7px] h-[3px] w-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--cotto) 0 7px, transparent 7px 14px)",
        }}
      />
      {/* navicella sulla punta della rotta */}
      <div ref={shipRef} className="absolute top-0" style={{ left: "-12px" }}>
        <SailboatIcon className="w-6 text-cotto drop-shadow-sm" />
      </div>
    </div>
  );
}
