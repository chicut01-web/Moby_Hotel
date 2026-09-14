import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Il logo HEY! — archi del convento, barra, scritta e payoff — estratto
 * in vettoriale dal manuale in style/ e normalizzato a 1000 di larghezza.
 *
 * File statici in public/brand/ invece di SVG in linea: l'intestazione è
 * un componente client, e quei tracciati sarebbero finiti in ogni pagina
 * due volte, nell'HTML e nel bundle JavaScript. Così è un file in cache.
 */
const VARIANTI = {
  /* archi + barra + HEY! + HUB FOR EUROPEAN YOUTH */
  completo: { file: "hey", w: 1000, h: 988 },
  /* HEY! + payoff, senza archi: per gli spazi larghi e bassi */
  scritta: { file: "hey-scritta", w: 1000, h: 457 },
} as const;

export function HeyLogo({
  variante = "completo",
  colore = "blu",
  decorativo = false,
  priority = false,
  className,
}: {
  variante?: keyof typeof VARIANTI;
  colore?: "blu" | "scuro" | "bianco";
  /** Vero quando il nome è già dato da chi lo contiene (es. aria-label del link). */
  decorativo?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const { file, w, h } = VARIANTI[variante];
  return (
    <Image
      src={`/brand/${file}-${colore}.svg`}
      width={w}
      height={h}
      alt={decorativo ? "" : "HEY! Hub for European Youth"}
      unoptimized
      priority={priority}
      draggable={false}
      className={cn("h-auto select-none", className)}
    />
  );
}
