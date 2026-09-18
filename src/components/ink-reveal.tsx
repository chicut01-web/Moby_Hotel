"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { paginaGiaDipinta } from "@/lib/after-hydration";
import { cn } from "@/lib/utils";

const SAFETY_MS = 1200;

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
  const [nascosto, setNascosto] = useState(paginaGiaDipinta);
  const [mostra, setMostra] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {

      setMostra(true);
      return;
    }

    setNascosto(true);
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setMostra(true);
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
  const inAttesa = nascosto && !mostra;

  if (reduced) return <Tag className={cn(className)}>{text}</Tag>;

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((word, i) => (

        <span key={`${word}-${i}`}>
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={false}
            animate={
              inAttesa
                ? { opacity: 0, y: 14, filter: "blur(7px)" }
                : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            transition={
              inAttesa
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 140,
                    damping: 20,
                    mass: 0.7,
                    delay: (startDelay + i * stagger) / 1000,
                  }
            }
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </Tag>
  );
}
