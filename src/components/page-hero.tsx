import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";
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
    <section className="relative overflow-hidden bg-gradient-to-b from-carta to-cielo/20">
      <ArchColonnade
        count={4}
        className="pointer-events-none absolute bottom-0 right-0 h-28 w-72 max-w-none text-blu-testo/15 sm:h-32 sm:w-80"
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
    </section>
  );
}
