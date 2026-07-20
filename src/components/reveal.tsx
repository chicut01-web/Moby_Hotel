"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Rivela il contenuto quando entra in viewport (fade + salita a molla),
 * una volta sola. `delay` in ms per lo stagger.
 *
 * REGOLA: il contenuto non deve MAI dipendere dall'animazione per essere
 * visibile. `whileInView` di Motion non scatta in modo affidabile quando
 * il nodo viene montato durante una navigazione client-side (l'elemento
 * è già in viewport e l'IntersectionObserver non riceve mai un cambio):
 * il risultato erano sezioni invisibili finché non si ricaricava la
 * pagina. Qui l'osservatore è esplicito e c'è comunque una rete di
 * sicurezza: passato il timeout, si rivela a prescindere.
 */
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);

    // Rete di sicurezza: se per qualsiasi motivo l'osservatore non
    // notifica (mount durante una transizione, layout che non cambia
    // più), il contenuto compare comunque.
    const safety = window.setTimeout(show, SAFETY_MS);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  if (reduced) return <div className={cn(className)}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.8,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
