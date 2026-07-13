"use client";

import { useEffect, useRef } from "react";

/**
 * Scia del cursore "rotta di mappa antica": il mouse lascia dietro di sé un
 * tratteggio ambra che sbiadisce (i trattini restano ancorati alla "carta",
 * non slittano). Al click stampa una piccola ✕ color tramonto che svanisce.
 * Solo puntatori fini (niente touch) e disattivata con prefers-reduced-motion.
 */
export function MapCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type TrailPoint = { x: number; y: number; t: number; d: number };
    type Mark = { x: number; y: number; t: number };

    const TRAIL_LIFE = 900; // ms di vita di un tratto
    const MARK_LIFE = 1100; // ms di vita della ✕
    const MIN_SEGMENT = 10; // px minimi tra due punti campionati
    const MAX_POINTS = 120;

    const points: TrailPoint[] = [];
    const marks: Mark[] = [];
    let last: { x: number; y: number } | null = null;
    let pathLength = 0;
    let raf = 0;
    let running = false;

    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      while (points.length && now - points[0].t > TRAIL_LIFE) points.shift();
      for (let i = marks.length - 1; i >= 0; i--) {
        if (now - marks[i].t > MARK_LIFE) marks.splice(i, 1);
      }

      if (points.length > 1) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.setLineDash([5, 7]);
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const alpha = Math.max(0, 1 - (now - p1.t) / TRAIL_LIFE) * 0.65;
          if (alpha <= 0.01) continue;
          ctx.strokeStyle = `rgba(223, 151, 58, ${alpha})`;
          // Ancora i trattini alla lunghezza percorsa: restano "sulla carta".
          ctx.lineDashOffset = -p0.d;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      for (const mark of marks) {
        const age = now - mark.t;
        const alpha = Math.max(0, 1 - age / MARK_LIFE);
        const size = 6 + 2 * (age / MARK_LIFE);
        ctx.strokeStyle = `rgba(217, 107, 63, ${0.9 * alpha})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(mark.x - size, mark.y - size);
        ctx.lineTo(mark.x + size, mark.y + size);
        ctx.moveTo(mark.x + size, mark.y - size);
        ctx.lineTo(mark.x - size, mark.y + size);
        ctx.stroke();
      }

      if (points.length > 1 || marks.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        // Niente da disegnare: ferma il loop finché il mouse non si muove.
        running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const ensureLoop = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (!last) {
        last = { x, y };
        points.push({ x, y, t: performance.now(), d: 0 });
        ensureLoop();
        return;
      }
      const segment = Math.hypot(x - last.x, y - last.y);
      if (segment >= MIN_SEGMENT) {
        pathLength += segment;
        points.push({ x, y, t: performance.now(), d: pathLength });
        if (points.length > MAX_POINTS) points.shift();
        last = { x, y };
        ensureLoop();
      }
    };

    const onClick = (e: MouseEvent) => {
      marks.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (marks.length > 6) marks.shift();
      ensureLoop();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
