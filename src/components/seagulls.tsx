import { cn } from "@/lib/utils";

const GULLS = [
  { top: "14%", duration: 46, delay: 0, scale: 1 },
  { top: "26%", duration: 58, delay: -22, scale: 0.7 },
  { top: "8%", duration: 70, delay: -40, scale: 0.55 },
] as const;

/**
 * Gabbiani stilizzati che attraversano lentamente la sezione (decorativi).
 * Traversata lineare + beccheggio sinusoidale, opacità bassa.
 */
export function Seagulls({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {GULLS.map((gull, i) => (
        <div
          key={i}
          className="seagull-track"
          style={{
            top: gull.top,
            animationDuration: `${gull.duration}s`,
            animationDelay: `${gull.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 40 16"
            fill="none"
            className="seagull-bob text-inchiostro/30"
            style={{
              width: `${34 * gull.scale}px`,
              animationDelay: `${gull.delay * 0.3}s`,
            }}
          >
            <path
              d="M 2 11 Q 11 3 20 10 Q 29 3 38 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
