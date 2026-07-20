"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "@/i18n/navigation";

/**
 * Passaggio tra le pagine: la pagina uscente si congeda (dissolve e
 * scorre) e solo dopo entra la nuova — `AnimatePresence mode="wait"`,
 * cosa impossibile con le sole animazioni CSS, dove il nodo vecchio
 * sparisce all'istante. Con prefers-reduced-motion niente wrapper
 * animato.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ type: "spring", stiffness: 130, damping: 20, mass: 0.7 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
