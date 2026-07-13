import { cn } from "@/lib/utils";

/** Veliero stilizzato a inchiostro (scafo, due vele, bandierina). */
export function SailboatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* scafo */}
      <path
        d="M 6 30 L 42 30 L 36 37 L 12 37 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* albero */}
      <path d="M 24 6 L 24 30" stroke="currentColor" strokeWidth="1.6" />
      {/* vela maestra */}
      <path d="M 26 8 Q 38 18 26 28 Z" fill="currentColor" opacity="0.65" />
      {/* fiocco */}
      <path d="M 22 11 Q 12 19 22 28 Z" fill="currentColor" opacity="0.5" />
      {/* bandierina */}
      <path d="M 24 6 L 30 8 L 24 10 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Veliero in traversata lenta (75s), con rollio, da appoggiare vicino a un
 * orizzonte (es. sopra il WaveDivider dell'hero). Decorativo.
 */
export function SailboatCrossing({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-4 h-12 overflow-hidden",
        className,
      )}
    >
      <div className="sail-track bottom-0">
        <SailboatIcon className="sail-roll w-10 text-inchiostro/40" />
      </div>
    </div>
  );
}
