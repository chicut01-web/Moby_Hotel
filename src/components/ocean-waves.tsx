import { cn } from "@/lib/utils";

/**
 * Linee d'onda a inchiostro che si muovono orizzontalmente a velocità diverse
 * (riuso delle classi `animate-wave-slow/medium/fast` già definite in globals.css).
 * Strati sovrapposti danno profondità di "mare in movimento" all'orizzonte.
 */
export function OceanWaves({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden",
        className,
      )}
    >
      {/* Strato lontano — più chiaro, più lento */}
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className={cn(
          "animate-wave-slow absolute bottom-0 left-0 h-16 w-[140%]",
          "text-inchiostro/[0.04]",
        )}
      >
        <path
          d="M 0 40 Q 100 20 200 40 T 400 40 T 600 40 T 800 40 T 1000 40 T 1200 40 V 80 H 0 Z"
          fill="currentColor"
        />
      </svg>

      {/* Strato medio */}
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className={cn(
          "animate-wave-medium absolute bottom-0 left-0 h-12 w-[140%]",
          "text-salvia/[0.06]",
        )}
      >
        <path
          d="M 0 44 Q 80 24 160 44 T 320 44 T 480 44 T 640 44 T 800 44 T 960 44 T 1120 44 T 1200 44 V 80 H 0 Z"
          fill="currentColor"
        />
      </svg>

      {/* Strato vicino — più scuro, più veloce */}
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className={cn(
          "animate-wave-fast absolute bottom-0 left-0 h-9 w-[140%]",
          "text-salvia/[0.08]",
        )}
      >
        <path
          d="M 0 50 Q 60 30 120 50 T 240 50 T 360 50 T 480 50 T 600 50 T 720 50 T 840 50 T 960 50 T 1080 50 T 1200 50 V 80 H 0 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
