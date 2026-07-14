import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";
import { WaveDivider } from "@/components/wave-divider";
import { InkReveal } from "@/components/ink-reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-calce to-pietra-soft/20">
      <ArchColonnade
        count={7}
        className="pointer-events-none absolute -bottom-2 right-0 h-32 w-[34rem] max-w-none text-salvia/15"
      />
      <Container className="relative py-16 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <InkReveal
          as="h1"
          text={title}
          className="mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl"
        />
        {subtitle ? (
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </Container>
      <WaveDivider waveColorClass="fill-background" className="translate-y-px" />
    </section>
  );
}
