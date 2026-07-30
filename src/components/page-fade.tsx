"use client";

import { usePathname } from "@/i18n/navigation";

/**
 * Dissolvenza d'ingresso al cambio pagina.
 *
 * Un `div` normale con un'animazione CSS, non un elemento animato da una
 * libreria: la differenza è che l'animazione finisce e non lascia niente
 * attaccato. La versione precedente teneva `opacity` e `will-change`
 * scritti sull'elemento per sempre, e in WebKit quel contesto di
 * composizione impediva al pin `sticky` dell'intro di essere dipinto —
 * la home restava vuota finché non si ricaricava.
 *
 * Nessuna uscita: animare anche la pagina che se ne va vuol dire tenerla
 * in vita mentre la nuova arriva, e l'attesa si legge come "non carica".
 */
export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
