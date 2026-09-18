
const ARCO = "M67.6 375.5L67.6 313.5L67.6 313.5L67.6 118.7C67.6 108.5 69.5 99.5 73.3 91.9C78.4 81.7 86.2 74.8 97.6 70.6C107.2 66.9 118 66.9 127.6 70.5C139 74.8 146.8 81.6 151.9 91.9C155.6 99.4 157.6 108.5 157.6 118.7L157.6 301L157.6 313.5L157.6 375.5L225.1 375.5L225.1 313.5L225.1 301L225.1 115.3C225.1 93.4 220.5 73.6 211.3 56.5C202 39 188.7 25 171.7 15C154.8 5.1 134.9 0 112.6 0C90.3 0 70.5 5.1 53.6 15C36.6 25 23.3 39 13.9 56.4C4.7 73.6 0 93.5 0 115.3L0 306.7L0 313.5L0 375.5Z";
const LARGHEZZA_ARCO = 225.1;
const PASSO = 257.9;
const ALTEZZA_ARCO = 375.5;
const BARRA_Y = 429.1;
const BARRA_H = 48.3;

export function ArchColonnade({
  className,
  count = 4,
  base = true,
}: {
  className?: string;
  count?: number;

  base?: boolean;
}) {
  const w = (count - 1) * PASSO + LARGHEZZA_ARCO;
  const h = base ? BARRA_Y + BARRA_H : ALTEZZA_ARCO;

  return (
    <svg
      viewBox={`0 0 ${w.toFixed(1)} ${h.toFixed(1)}`}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={ARCO}
          transform={i ? `translate(${(i * PASSO).toFixed(1)} 0)` : undefined}
        />
      ))}
      {base ? <rect x="0" y={BARRA_Y} width={w} height={BARRA_H} /> : null}
    </svg>
  );
}
