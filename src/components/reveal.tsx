"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Rivela il contenuto quando entra in viewport (fade + salita a molla),
 * una volta sola. `delay` in ms per lo stagger.
 *
 * REGOLA: il contenuto non deve MAI dipendere dall'animazione per essere
 * visibile — e "visibile" include il tempo prima che il JavaScript sia
 * pronto. Con uno stato iniziale nascosto, Motion lo scrive già nell'HTML
 * del server: erano 34 elementi a `opacity: 0` per tutta l'attesa
 * dell'idratazione (misurati 3.6s a 1.5 Mbps), e per sempre se lo script
 * non arrivava.
 *
 * Quindi il markup nasce visibile (`initial={false}`) e si nasconde solo
 * dopo, e solo se l'elemento è **fuori schermo**: lì nascondere non si
 * vede, e chi è già in vista resta dov'è invece di rifare l'ingresso.
 * L'osservatore è esplicito perché `whileInView` non scatta quando il
 * nodo viene montato già dentro il viewport, con una rete di sicurezza
 * a tempo per i casi in cui non notifichi affatto.
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
  const [nascosto, setNascosto] = useState(false);
  const [mostra, setMostra] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Già sotto gli occhi: niente da rivelare, si resta visibili.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;

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
      // Nessuno stile iniziale: quello che esce dal server è già leggibile.
      initial={false}
      animate={inAttesa ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
      transition={
        inAttesa
          ? { duration: 0 } // sparire fuori schermo dev'essere istantaneo
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
