import { cn } from "@/lib/utils";

const BUBBLES = [
  { left: "12%", size: 10, duration: 11, delay: 0 },
  { left: "26%", size: 6, duration: 14, delay: -3 },
  { left: "40%", size: 14, duration: 9, delay: -6 },
  { left: "58%", size: 8, duration: 12, delay: -1 },
  { left: "70%", size: 5, duration: 16, delay: -8 },
  { left: "82%", size: 11, duration: 10, delay: -4 },
  { left: "92%", size: 7, duration: 13, delay: -9 },
] as const;

/**
 * Bolle marine che salgono lentamente (riuso della classe `bubble-item` già
 * definita in globals.css). Cerchi salici a bassa opacità — ambient, decorativo.
 */
export function Bubbles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble-item absolute bottom-0 rounded-full"
          style={{
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            background:
              "radial-gradient(circle at 32% 30%, rgba(217,234,246,0.5), rgba(46,111,163,0.12))",
            border: "1px solid rgba(46,111,163,0.18)",
          }}
        />
      ))}
    </div>
  );
}
