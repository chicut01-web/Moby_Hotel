import { cn } from "@/lib/utils";

/**
 * Balena stilizzata a inchiostro (omaggio a Moby Dick ETS), galleggia piano
 * con la keyframe `whale-float` già definita in globals.css.
 */
export function Whale({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 48"
      fill="none"
      aria-hidden="true"
      className={cn("animate-whale text-salvia", className)}
    >
      {/* corpo */}
      <path
        d="M 10 26 Q 26 8 52 12 Q 74 15 82 26 Q 74 36 52 37 Q 26 40 10 26 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* coda */}
      <path
        d="M 80 25 Q 88 18 94 12 Q 92 22 90 26 Q 92 30 94 40 Q 88 34 80 28 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* occhio */}
      <circle cx="24" cy="24" r="1.8" fill="var(--calce)" />
      {/* soffio */}
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
        <path d="M 30 10 Q 28 5 24 3" />
        <path d="M 30 10 Q 32 5 36 3" />
        <path d="M 30 10 L 30 4" />
      </g>
    </svg>
  );
}
