import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Accessibility, Columns3, Mountain } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { RoomCard } from "@/components/room-card";
import { Reveal } from "@/components/reveal";
import { TiltCard } from "@/components/tilt-card";
import { Magnetic } from "@/components/magnetic";
import { InkReveal } from "@/components/ink-reveal";
import { CountUp } from "@/components/count-up";
import { Manifesto } from "@/components/manifesto";
import { IntroScrub } from "@/components/intro-scrub";
import { HeyLogo } from "@/components/hey-logo";

import { getActiveRooms } from "@/lib/rooms";
import { roomCoverImage } from "@/lib/room-images";
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

  /**
   * In vetrina prima le camere che hanno una fotografia.
   * L'elenco completo è ordinato per prezzo, e le camerate — le più
   * economiche — finivano in home proprio mentre sono le uniche senza
   * scatto: tre riquadri di cui due col solo motivo ad archi. Il
   * segnaposto va bene in /camere, dove si sfoglia tutto; qui è la prima
   * impressione. Chi non ha foto scala in fondo alla coda, non sparisce:
   * se un giorno le camerate saranno fotografate, tornano da sole, e se
   * le foto mancassero del tutto la home mostrerebbe comunque tre camere.
   */
  const tutte = await getActiveRooms();
  const rooms = tutte.filter((r) => Boolean(roomCoverImage(r))).slice(0, 3);

  return (
    <>
      {/* Apertura: il volo sul convento scandito dallo scroll */}
      <IntroScrub />

      {/* Hero a tutta pagina con la nuova foto del chiostro e grafica HEY! */}
      <section className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-center py-20 sm:py-28">
        {/* Foto a tutto schermo */}
        <div className="absolute inset-0">
          <Image
            src="/images/chiostro-hero.jpg"
            alt={t("hero.imageAlt")}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          {/* Sfumatura morbida a sinistra per contrasto sui testi, lasciando la foto luminosa e visibile */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-r from-black/70 via-black/30 via-38% to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 block lg:hidden bg-gradient-to-t from-black/80 via-black/40 to-black/10"
          />
        </div>

        {/* Tutto a sinistra: Logo HEY! e sotto testi e call to action */}
        <Container className="relative z-10">
          <div className="max-w-2xl text-left animate-in fade-in slide-in-from-bottom-3 duration-700">
            {/* Logo HEY! completo in bianco */}
            <div className="mb-7 sm:mb-9">
              <HeyLogo
                variante="completo"
                colore="bianco"
                priority
                className="w-32 sm:w-40 md:w-48 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
              />
            </div>

            {/* Eyebrow */}
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#9bd2eb] drop-shadow">
              {t("hero.eyebrow")}
            </p>

            {/* Titolo principale a due colori */}
            <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              <span className="block">{t("hero.title")}</span>
              <span className="block text-[#7ec6e6]">{t("hero.titleAccent")}</span>
            </h1>

            {/* Sottotitolo */}
            <p className="mt-6 max-w-xl text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              {t("hero.subtitle")}
            </p>

            {/* Pulsanti di azione */}
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Button
                asChild
                size="lg"
                className="btn-shine rounded-full bg-white px-8 font-bold text-blu-scuro hover:bg-white/90 shadow-2xl"
              >
                <Magnetic>
                  <Link href="/prenota">{t("hero.ctaPrimary")}</Link>
                </Magnetic>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/60 bg-black/25 px-8 font-medium text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
              >
                <Link href="/convento">{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="eyebrow">{t("intro.eyebrow")}</p>
            <InkReveal text={t("intro.title")} className="mt-4 text-3xl sm:text-4xl" />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>{t("intro.body1")}</p>
            <p>{t("intro.body2")}</p>
          </div>
        </Container>
      </section>

      {/* Manifesto: le tre frasi del manuale del logo */}
      <Manifesto />

      {/* Stats band */}
      <section className="border-y border-border/50 bg-grigio/40 py-12 sm:py-16">
        <Container>
          <p className="eyebrow text-center">{t("stats.eyebrow")}</p>
          <div className="mt-8 grid gap-8 text-center sm:grid-cols-3">
            <Reveal>
              <span className="block font-heading text-4xl font-black tracking-tight text-blu sm:text-5xl">
                <CountUp value={Number(t("stats.years.value"))} suffix={t("stats.years.suffix")} />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {t("stats.years.label")}
              </span>
            </Reveal>
            <Reveal delay={120}>
              <span className="block font-heading text-4xl font-black tracking-tight text-blu sm:text-5xl">
                <CountUp value={Number(t("stats.rooms.value"))} suffix={t("stats.rooms.suffix")} />
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {t("stats.rooms.label")}
              </span>
            </Reveal>
            <Reveal delay={240}>
              <span className="block font-heading text-4xl font-black tracking-tight text-blu sm:text-5xl">
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
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-blu-scuro">
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
          <div className="relative overflow-hidden rounded-3xl bg-blu-scuro px-7 py-14 text-carta sm:px-14">
            <div className="relative max-w-xl">
              <InkReveal
                text={t("cta.title")}
                className="text-3xl text-carta sm:text-4xl"
              />
              <p className="mt-4 leading-relaxed text-carta">
                {t("cta.body")}
              </p>
              <Button
                asChild
                size="lg"
                className="btn-shine mt-8 rounded-full bg-carta px-7 text-foreground hover:bg-carta/90"
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
