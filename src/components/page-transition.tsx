"use client";

import { usePathname } from "@/i18n/navigation";

/**
 * Riattiva l'animazione di ingresso `page-enter` a ogni cambio di rotta:
 * usa il pathname come `key` del wrapper, così React rimonta il nodo e
 * la keyframe riparte (fade + slide dal basso + lieve blur).
 * Con prefers-reduced-motion il CSS (.page-enter è neutralizzata) mostra
 * tutto subito.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
