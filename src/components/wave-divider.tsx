import { cn } from "@/lib/utils";

export function WaveDivider({
  className,
  flipped = false,
  waveColorClass = "fill-background",
}: {
  className?: string;
  flipped?: boolean;
  waveColorClass?: string;
}) {
  // A scalloped edge (mini-arches) mimicking vintage postage stamps or paper trim.
  // ViewBox is 100 x 10.
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden leading-[0] pointer-events-none select-none",
        flipped ? "rotate-180" : "",
        className
      )}
    >
      <svg
        className="relative block w-full h-4 sm:h-6 lg:h-8"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <path
          d="M 0 10 L 0 3 Q 2.5 0 5 3 Q 7.5 0 10 3 Q 12.5 0 15 3 Q 17.5 0 20 3 Q 22.5 0 25 3 Q 27.5 0 30 3 Q 32.5 0 35 3 Q 37.5 0 40 3 Q 42.5 0 45 3 Q 47.5 0 50 3 Q 52.5 0 55 3 Q 57.5 0 60 3 Q 62.5 0 65 3 Q 67.5 0 70 3 Q 72.5 0 75 3 Q 77.5 0 80 3 Q 82.5 0 85 3 Q 87.5 0 90 3 Q 92.5 0 95 3 Q 97.5 0 100 3 L 100 10 Z"
          className={waveColorClass}
        />
        {/* Subtle print stroke matching the scallop shape */}
        <path
          d="M 0 3 Q 2.5 0 5 3 Q 7.5 0 10 3 Q 12.5 0 15 3 Q 17.5 0 20 3 Q 22.5 0 25 3 Q 27.5 0 30 3 Q 32.5 0 35 3 Q 37.5 0 40 3 Q 42.5 0 45 3 Q 47.5 0 50 3 Q 52.5 0 55 3 Q 57.5 0 60 3 Q 62.5 0 65 3 Q 67.5 0 70 3 Q 72.5 0 75 3 Q 77.5 0 80 3 Q 82.5 0 85 3 Q 87.5 0 90 3 Q 92.5 0 95 3 Q 97.5 0 100 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-border/30"
        />
      </svg>
    </div>
  );
}
