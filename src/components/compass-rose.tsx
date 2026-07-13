import { cn } from "@/lib/utils";

/**
 * Rosa dei venti a 8 punte, decoro da carta nautica. Con
 * `.animate-slow-spin` ruota impercettibilmente (90s/giro).
 */
export function CompassRose({ className }: { className?: string }) {
  const long = [
    "M 50 4 L 55 45 L 50 50 L 45 45 Z",
    "M 96 50 L 55 55 L 50 50 L 55 45 Z",
    "M 50 96 L 45 55 L 50 50 L 55 55 Z",
    "M 4 50 L 45 45 L 50 50 L 45 55 Z",
  ];
  const short = [
    "M 79 21 L 57 47 L 53 43 Z",
    "M 79 79 L 53 57 L 57 53 Z",
    "M 21 79 L 43 53 L 47 57 Z",
    "M 21 21 L 47 43 L 43 47 Z",
  ];
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn("text-inchiostro", className)}
    >
      <circle
        cx="50"
        cy="50"
        r="47"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="2.5 4"
        opacity="0.5"
      />
      {short.map((d, i) => (
        <path key={`s${i}`} d={d} fill="currentColor" opacity="0.35" />
      ))}
      {long.map((d, i) => (
        <path key={`l${i}`} d={d} fill="currentColor" opacity="0.6" />
      ))}
      <circle cx="50" cy="50" r="3.5" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
