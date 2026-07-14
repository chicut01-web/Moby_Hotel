import { cn } from "@/lib/utils";

function Tentacle({
  className,
  delay,
  flip = false,
}: {
  className?: string;
  delay: number;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 40 90"
      fill="none"
      aria-hidden="true"
      className={cn("kraken-tentacle", className)}
      style={{
        animationDelay: `${delay}s`,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      {/* tentacolo ricurvo con ventose */}
      <path
        d="M 20 90 C 14 62 8 48 14 32 C 20 16 34 14 36 4 C 26 12 12 12 8 30 C 4 48 12 64 14 90 Z"
        fill="currentColor"
      />
      <circle cx="15.5" cy="42" r="2" fill="var(--calce-deep)" opacity="0.5" />
      <circle cx="14" cy="54" r="2.3" fill="var(--calce-deep)" opacity="0.5" />
      <circle cx="15" cy="67" r="2.6" fill="var(--calce-deep)" opacity="0.5" />
      <circle cx="19" cy="30" r="1.7" fill="var(--calce-deep)" opacity="0.5" />
    </svg>
  );
}

/**
 * Il kraken abita sotto il footer: tre tentacoli spuntano da dietro la
 * cresta dell'onda e ondeggiano piano. "Hic sunt dracones."
 */
export function Kraken({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -top-12 right-[10%] flex items-end gap-1 text-salvia/50",
        className,
      )}
    >
      <Tentacle className="h-14 w-7" delay={-2.5} flip />
      <Tentacle className="h-20 w-9" delay={0} />
      <Tentacle className="h-12 w-6" delay={-4.8} flip />
    </div>
  );
}
