"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * Titolo che "si scrive" a inchiostro, parola per parola, quando entra in
 * viewport. Generalizza l'effetto ink-in già usato nell'hero (keyframe
 * definita in globals.css). L'attivazione avviene una sola volta.
 * Con prefers-reduced-motion il CSS mostra tutto subito.
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
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = (as ?? "h2") as ElementType;
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={cn("ink-word", wordClassName)}
          style={{
            animationDelay: active
              ? `${startDelay + i * stagger}ms`
              : undefined,
            animationPlayState: active ? "running" : "paused",
          }}
        >
          {word}
          {" "}
        </span>
      ))}
    </Tag>
  );
}
