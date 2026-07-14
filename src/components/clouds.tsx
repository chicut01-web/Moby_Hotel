import { cn } from "@/lib/utils";

const CLOUDS = [
  { top: "10%", duration: 130, delay: 0, scale: 1 },
  { top: "20%", duration: 175, delay: -60, scale: 0.7 },
  { top: "6%", duration: 150, delay: -110, scale: 1.25 },
] as const;

/**
 * Nubi stilizzate a inchiostro che attraversano piano il cielo (ambient).
 * Opacità molto bassa per non disturbare la leggibilità.
 */
export function Clouds({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="drift-cloud absolute left-0"
          style={{
            top: cloud.top,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 120 40"
            fill="none"
            className="text-inchiostro/[0.05]"
            style={{ width: `${120 * cloud.scale}px` }}
          >
            <path
              d="M 14 30 Q 4 30 6 22 Q 4 14 16 16 Q 22 6 36 12 Q 50 4 60 16 Q 76 10 82 22 Q 98 20 96 30 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
