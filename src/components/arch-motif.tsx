import { cn } from "@/lib/utils";

/**
 * Colonnato di archi: silhouette del porticato del chiostro.
 * Elemento grafico ricorrente, usato come firma visiva al posto delle foto.
 */
export function ArchColonnade({
  className,
  count = 5,
}: {
  className?: string;
  count?: number;
}) {
  const w = 60;
  const H = 172;
  const spring = 74;
  const arches = Array.from({ length: count }, (_, i) => {
    const x = i * w;
    return `M ${x} ${H} L ${x} ${spring} A ${w / 2} ${w / 2} 0 0 1 ${
      x + w
    } ${spring} L ${x + w} ${H}`;
  });

  return (
    <svg
      viewBox={`0 0 ${count * w} 180`}
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {arches.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <line
        x1="0"
        y1={H}
        x2={count * w}
        y2={H}
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

type Tone = "salvia" | "cotto" | "pietra";

const toneClasses: Record<Tone, string> = {
  salvia: "from-salvia-soft to-calce text-salvia",
  cotto: "from-cotto/10 to-calce text-cotto",
  pietra: "from-pietra-soft to-calce text-pietra",
};

/**
 * Pannello "ad arco" tinta calce: sfondo materico + colonnato, usato come
 * segnaposto immagine (camere, hero) finché non ci sono le foto reali.
 */
export function ArchPlaceholder({
  label,
  tone = "salvia",
  className,
}: {
  label?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-end justify-center overflow-hidden bg-gradient-to-b",
        toneClasses[tone],
        className,
      )}
    >
      <ArchColonnade
        count={6}
        className="w-[118%] max-w-none translate-y-px opacity-55"
      />
      {label ? (
        <span className="absolute left-5 top-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-current opacity-80">
          {label}
        </span>
      ) : null}
    </div>
  );
}
