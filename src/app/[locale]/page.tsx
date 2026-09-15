import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Accessibility,
  CalendarCheck,
  Columns3,
  MapPin,
  Mountain,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { InkReveal } from "@/components/ink-reveal";
import { CountUp } from "@/components/count-up";
import { Manifesto } from "@/components/manifesto";
import { IntroScrub } from "@/components/intro-scrub";
import { HeyLogo } from "@/components/hey-logo";
import type { Locale } from "@/i18n/routing";

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

  return (
    <>
      {/* 1. Apertura: il video del convento in loop continuo */}
      <IntroScrub />

      {/* 2. Chi siamo: posizionato subito dopo il video, prima della prima foto, con ampio respiro */}
      <section className="bg-background py-24 sm:py-32">
        <Container className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 items-start">
          <div>
            <p className="eyebrow">{t("intro.eyebrow")}</p>
            <InkReveal
              text={t("intro.title")}
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
            />
          </div>
          <div className="space-y-6 text-lg sm:text-xl leading-relaxed text-muted-foreground">
            <p>{t("intro.body1")}</p>
            <p>{t("intro.body2")}</p>
          </div>
        </Container>
      </section>

      {/* 3. Prima foto: Hero Chiostro a tutta pagina con logo e call to action */}
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
          {/* Sfumatura laterale in blu scuro, concentrata a sinistra per non coprire troppo la foto */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-r from-blu-scuro/90 via-blu-scuro/45 via-32% to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 block lg:hidden bg-gradient-to-t from-blu-scuro/90 via-blu-scuro/50 via-40% to-transparent"
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

      {/* 4. In cifre: posizionato tra le due foto, su sfondo bianco, con la stessa ampiezza di Chi siamo */}
      <section className="bg-background py-24 sm:py-32 border-y border-border/40">
        <Container>
          <p className="eyebrow text-center">{t("stats.eyebrow")}</p>
          <div className="mt-12 grid gap-10 text-center sm:grid-cols-3">
            <Reveal>
              <span className="block font-heading text-5xl font-black tracking-tight text-blu sm:text-6xl">
                <CountUp
                  value={Number(t("stats.years.value"))}
                  suffix={t("stats.years.suffix")}
                />
              </span>
              <span className="mt-3 block text-base font-medium text-muted-foreground">
                {t("stats.years.label")}
              </span>
            </Reveal>
            <Reveal delay={120}>
              <span className="block font-heading text-5xl font-black tracking-tight text-blu sm:text-6xl">
                <CountUp
                  value={Number(t("stats.rooms.value"))}
                  suffix={t("stats.rooms.suffix")}
                />
              </span>
              <span className="mt-3 block text-base font-medium text-muted-foreground">
                {t("stats.rooms.label")}
              </span>
            </Reveal>
            <Reveal delay={240}>
              <span className="block font-heading text-5xl font-black tracking-tight text-blu sm:text-6xl">
                <CountUp
                  value={Number(t("stats.altitude.value"))}
                  suffix={t("stats.altitude.suffix")}
                />
              </span>
              <span className="mt-3 block text-base font-medium text-muted-foreground">
                {t("stats.altitude.label")}
              </span>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 5. Seconda foto: Manifesto a tutta pagina sul porticato */}
      <Manifesto />

      {/* 6. Highlights */}
      <section className="py-20 sm:py-28">
        <Container>
          <h2 className="sr-only">{t("highlights.title")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {HIGHLIGHTS.map(({ key, Icon }, i) => (
              <Reveal key={key} delay={i * 110} className="h-full">
                <div className="lantern-card h-full rounded-2xl border border-border/70 bg-card p-8">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-blu-scuro">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold">
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

      {/* 7. CTA band riprogettata: layout equilibrato con riquadro informativo a destra */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blu-scuro via-[#173a52] to-blu-scuro p-8 sm:p-12 lg:p-16 text-carta shadow-2xl border border-white/10">
              {/* Luci ambientali diffuse */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-[#7ec6e6]/15 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 -bottom-16 size-80 rounded-full bg-white/5 blur-3xl"
              />

              <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                {/* Colonna sinistra: invito, descrizione e pulsanti d'azione */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9bd2eb]">
                    {t("cta.eyebrow")}
                  </p>
                  <InkReveal
                    text={t("cta.title")}
                    className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight"
                  />
                  <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-carta/90">
                    {t("cta.body")}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4 items-center">
                    <Button
                      asChild
                      size="lg"
                      className="btn-shine rounded-full bg-white px-8 font-bold text-blu-scuro hover:bg-white/90 shadow-xl"
                    >
                      <Magnetic>
                        <Link href="/prenota">{t("cta.button")}</Link>
                      </Magnetic>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full border-white/40 bg-white/10 px-7 font-medium text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                    >
                      <Link href="/contatti">{t("cta.secondaryButton")}</Link>
                    </Button>
                  </div>
                </div>

                {/* Colonna destra: card informativa per riempire con valore e bellezza lo spazio */}
                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 sm:p-8 backdrop-blur-md space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#9bd2eb] shadow-inner">
                      <MapPin className="size-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {t("cta.features.location.title")}
                      </h4>
                      <p className="text-xs text-white/75 mt-0.5 leading-relaxed">
                        {t("cta.features.location.subtitle")}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-white/15" />

                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#9bd2eb] shadow-inner">
                      <Users className="size-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {t("cta.features.hospitality.title")}
                      </h4>
                      <p className="text-xs text-white/75 mt-0.5 leading-relaxed">
                        {t("cta.features.hospitality.subtitle")}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-white/15" />

                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#9bd2eb] shadow-inner">
                      <CalendarCheck className="size-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {t("cta.features.rates.title")}
                      </h4>
                      <p className="text-xs text-white/75 mt-0.5 leading-relaxed">
                        {t("cta.features.rates.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
