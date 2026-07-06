import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";

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
    <section className="relative overflow-hidden border-b border-border/60 bg-calce-deep">
      <ArchColonnade
        count={7}
        className="pointer-events-none absolute -bottom-2 right-0 h-32 w-[34rem] max-w-none text-salvia/25"
      />
      <Container className="relative py-16 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
