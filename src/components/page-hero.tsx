import { Container } from "@/components/container";
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
