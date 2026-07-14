import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * La balena di Moby Dick ETS: illustrazione cartoon con splash (PNG
 * trasparente in public/images). Galleggia piano con la keyframe
 * `whale-float` di globals.css. Decorativa: alt vuoto.
 */
export function Whale({ className }: { className?: string }) {
  return (
    <Image
      src="/images/balena.png"
      alt=""
      width={800}
      height={381}
      loading="eager"
      aria-hidden="true"
      className={cn("animate-whale h-auto select-none", className)}
      draggable={false}
    />
  );
}
