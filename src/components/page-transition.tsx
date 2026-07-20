"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "@/i18n/navigation";

/**
 * Passaggio tra le pagine: la pagina uscente dissolve mentre la nuova
 * entra (`mode="popLayout"`, sovrapposte). NON `mode="wait"`: quello
 * rimanda il montaggio del contenuto nuovo alla fine dell'uscita, e
 * l'attesa si legge come "la pagina non si carica". Le transizioni
 * restano brevi per lo stesso motivo. Con prefers-reduced-motion
 * nessun wrapper animato.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
