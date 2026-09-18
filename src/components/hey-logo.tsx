import Image from "next/image";
import { cn } from "@/lib/utils";

const VARIANTI = {

  completo: { file: "hey", w: 1000, h: 988 },

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
