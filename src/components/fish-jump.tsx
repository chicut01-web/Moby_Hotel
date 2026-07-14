import { cn } from "@/lib/utils";

function Fish({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 32 16"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M 4 8 Q 12 1 22 6 L 29 2 L 27 8 L 29 14 L 22 10 Q 12 15 4 8 Z"
        fill="currentColor"
      />
      <circle cx="9" cy="7.5" r="1.1" fill="var(--calce)" />
    </svg>
  );
}

const JUMPERS = [
  { left: "18%", delay: 0, scale: 1 },
  { left: "63%", delay: -3.7, scale: 0.75 },
  { left: "84%", delay: -6.4, scale: 0.6 },
] as const;

/**
 * Pesciolini che ogni tanto saltano fuori dall'onda (ciclo 9s, in scena
 * ~1.6s). Da appoggiare appena sopra un WaveDivider.
 */
export function FishJump({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-1 h-16 overflow-hidden",
        className,
      )}
    >
      {JUMPERS.map((jumper, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{ left: jumper.left }}
        >
          <Fish
            className={cn("fish-jumper text-salvia/60")}
            // stagger via delay; scala per profondità
            style={{
              width: `${26 * jumper.scale}px`,
              animationDelay: `${jumper.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
