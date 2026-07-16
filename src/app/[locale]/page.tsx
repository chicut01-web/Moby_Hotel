import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Accessibility, Columns3, Mountain } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";
import { RoomCard } from "@/components/room-card";
import { WaveDivider } from "@/components/wave-divider";
import { Reveal } from "@/components/reveal";
import { Seagulls } from "@/components/seagulls";
import { CompassRose } from "@/components/compass-rose";
import { SailboatCrossing } from "@/components/sailboat";
import { Clouds } from "@/components/clouds";
import { OceanWaves } from "@/components/ocean-waves";
import { Bubbles } from "@/components/bubbles";
import { TiltCard } from "@/components/tilt-card";
import { Magnetic } from "@/components/magnetic";
import { InkReveal } from "@/components/ink-reveal";
import { CountUp } from "@/components/count-up";
import { FishJump } from "@/components/fish-jump";
import { ManifestoVoyage } from "@/components/manifesto-voyage";

/** Parole del titolo che si "scrivono" a inchiostro, in cascata. */
function InkWords({
  text,
  startDelay = 0,
  className,
}: {
  text: string;
  startDelay?: number;
  className?: string;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        // Spazio FUORI dallo span: dentro un inline-block verrebbe
        // troncato (l'NBSP evitava il taglio ma bloccava il wrapping).
        <span key={`${word}-${i}`}>
          <span
            className={`ink-word ${className ?? ""}`}
            style={{ animationDelay: `${startDelay + i * 130}ms` }}
          >
            {word}
          </span>{" "}
        </span>
      ))}
    </>
  );
}
import { getActiveRooms } from "@/lib/rooms";
import type { Locale } from "@/i18n/routing";

// ISR: le camere arrivano dal DB, la pagina si rigenera senza rebuild.
export const revalidate = 300;

const HIGHLIGHTS = [
  { key: "chiostro", Icon: Columns3 },
  { key: "accessibilita", Icon: Accessibility },
  { key: "territorio", Icon: Mountain },
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const rooms = (await getActiveRooms()).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-salvia-soft/50 via-calce to-calce pt-6">
        <Clouds />
        <Seagulls />
        <CompassRose className="animate-slow-spin pointer-events-none absolute -right-16 -top-16 size-64 opacity-[0.07]" />
        <Container className="relative grid gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p
              className="eyebrow animate-in fade-in slide-in-from-bottom-2 duration-700"
              style={{ animationDelay: "60ms", animationFillMode: "both" }}
            >
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-5 text-[2.7rem] leading-[1.02] sm:text-6xl lg:text-7xl">
              <InkWords text={t("hero.title")} startDelay={120} />
              <span className="italic text-cotto">
                <InkWords
                  text={t("hero.titleAccent")}
                  startDelay={120 + (t("hero.title").split(" ").length + 1) * 130}
                />
              </span>
            </h1>
            <p
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              {t("hero.subtitle")}
            </p>
            <div
              className="mt-9 flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: "280ms", animationFillMode: "both" }}
            >
              <Button asChild size="lg" className="btn-shine rounded-full px-7">
                <Magnetic>
                  <Link href="/prenota">{t("hero.ctaPrimary")}</Link>
                </Magnetic>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border/80 px-7"
              >
                <Link href="/convento">{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>

          <div
            className="relative animate-in fade-in duration-1000"
            style={{ animationDelay: "180ms", animationFillMode: "both" }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[11rem] rounded-b-2xl ring-1 ring-border/70 shadow-[0_40px_80px_-50px_var(--inchiostro)]">
              <div className="parallax-drift absolute inset-0">
                <Image
                  src="/images/chiostro-alto.jpg"
                  alt={t("hero.imageAlt")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -left-4 bottom-10 hidden rounded-xl border border-border/70 bg-card/90 px-4 py-3 backdrop-blur sm:block">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-cotto">
                {t("hero.imageAlt")}
              </p>
            </div>
          </div>
        </Container>

        <OceanWaves className="h-28" />
        <Bubbles className="bottom-0 h-28" />
        <SailboatCrossing />
        <FishJump />
        <div aria-hidden="true" className="lighthouse-beam left-0" />
        <WaveDivider waveColorClass="fill-background" className="translate-y-px" />
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="eyebrow">{t("intro.eyebrow")}</p>
            <InkReveal text={t("intro.title")} className="mt-4 text-3xl sm:text-4xl" />
            <ArchColonnade
              count={4}
              className="mt-7 h-14 w-40 text-salvia/45"
            />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>{t("intro.body1")}</p>
            <p>{t("intro.body2")}</p>
          </div>
        </Container>
      </section>

      {/* Manifesto: traversata orizzontale guidata dallo scroll */}
      <ManifestoVoyage />

      {/* Stats band */}
      <section className="border-y border-border/50 bg-calce-deep/40 py-12 sm:py-16">
        <Container>
          <p className="eyebrow text-center">{t("stats.eyebrow")}</p>
          <div className="mt-8 grid gap-8 text-center sm:grid-cols-3">
            <Reveal>
              <span className="block font-serif text-4xl text-salvia sm:text-5xl">
                <CountUp value={Number(t("stats.years.value"))} suffix={t("stats.years.suffix")} />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {t("stats.years.label")}
              </span>
            </Reveal>
            <Reveal delay={120}>
              <span className="block font-serif text-4xl text-salvia sm:text-5xl">
                <CountUp value={Number(t("stats.rooms.value"))} suffix={t("stats.rooms.suffix")} />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {t("stats.rooms.label")}
              </span>
            </Reveal>
            <Reveal delay={240}>
              <span className="block font-serif text-4xl text-salvia sm:text-5xl">
                <CountUp value={Number(t("stats.altitude.value"))} suffix={t("stats.altitude.suffix")} />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {t("stats.altitude.label")}
              </span>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="pb-8">
        <Container>
          <h2 className="sr-only">{t("highlights.title")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {HIGHLIGHTS.map(({ key, Icon }, i) => (
              <Reveal key={key} delay={i * 110} className="h-full">
                <div className="lantern-card h-full rounded-2xl border border-border/70 bg-card p-7">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-salvia-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl">
                    {t(`highlights.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`highlights.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Rooms preview */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">{t("rooms.eyebrow")}</p>
              <InkReveal text={t("rooms.title")} className="mt-3 text-3xl sm:text-4xl" />
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {t("rooms.body")}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="shrink-0 rounded-full border-border/80"
            >
              <Link href="/camere">{t("rooms.cta")}</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, i) => (
              <Reveal key={room.id} delay={i * 110} className="h-full">
                <TiltCard className="h-full">
                  <RoomCard room={room} locale={locale} />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="pb-4">
        <Container>
          <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-cotto px-7 py-14 text-cotto-foreground sm:px-14">
            <ArchColonnade
              count={9}
              className="pointer-events-none absolute -bottom-2 right-0 h-44 w-[44rem] max-w-none text-cotto-foreground/15"
            />
            <div className="relative max-w-xl">
              <InkReveal
                text={t("cta.title")}
                className="text-3xl text-cotto-foreground sm:text-4xl"
              />
              <p className="mt-4 leading-relaxed text-cotto-foreground/85">
                {t("cta.body")}
              </p>
              <Button
                asChild
                size="lg"
                className="btn-shine mt-8 rounded-full bg-calce px-7 text-foreground hover:bg-calce/90"
              >
                <Magnetic>
                  <Link href="/prenota">{t("cta.button")}</Link>
                </Magnetic>
              </Button>
            </div>
          </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
