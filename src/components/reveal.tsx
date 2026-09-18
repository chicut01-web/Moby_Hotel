"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { paginaGiaDipinta } from "@/lib/after-hydration";
import { cn } from "@/lib/utils";

const SAFETY_MS = 1200;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    const safety = window.setTimeout(show, SAFETY_MS);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  if (reduced) return <div className={cn(className)}>{children}</div>;

  const inAttesa = nascosto && !mostra;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}

      initial={false}
      animate={inAttesa ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
      transition={
        inAttesa
          ? { duration: 0 } 
          : {
              type: "spring",
              stiffness: 120,
              damping: 20,
              mass: 0.8,
              delay: delay / 1000,
            }
      }
    >
      {children}
    </motion.div>
  );
}
