import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MailCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { InkReveal } from "@/components/ink-reveal";
import { TerritoryMap } from "@/components/territory-map";
import { MAPS_DIRECTIONS_URL, MAPS_EMBED_URL, SITE } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "metadata.pages.contatti",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: pageAlternates("/contatti", locale),
  };
}

export default async function ContattiPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contatti");
  const tt = await getTranslations("territorio");

  const items = [
    {
      Icon: MapPin,
      label: t("info.addressLabel"),
      value: SITE.address,
      href: undefined,
    },
    {
      Icon: Mail,
      label: t("info.emailLabel"),
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      Icon: MailCheck,
      label: t("info.pecLabel"),
      value: SITE.pec,
      href: `mailto:${SITE.pec}`,
    },
    {
      Icon: Clock,
      label: t("info.hoursLabel"),
      value: t("info.hours"),
      href: undefined,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-2">
              {items.map(({ Icon, label, value, href }) => (
                <div key={label} className="bg-card p-6">
                  <dt className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cotto">
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-2 text-foreground">
                    {href ? (
                      <a
                        href={href}
                        className="transition-colors hover:text-cotto"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <h2 className="text-2xl">{t("how.title")}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t("how.body")}
              </p>
            </div>
          </div>

          {/* Facciata + località */}
          <div className="lantern-card group relative min-h-72 overflow-hidden rounded-2xl border border-border/70">
            <Image
              src="/images/facciata.jpg"
              alt={t("map.photoAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-border/60 bg-calce/90 px-4 py-2 backdrop-blur">
              <MapPin className="size-4 text-cotto" aria-hidden="true" />
              <span className="font-serif text-lg text-foreground">
                {SITE.locality}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* L'ente gestore + mappa Google con indicazioni */}
      <section className="pb-16 sm:pb-20">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl border border-border/70 bg-card p-7">
              <h2 className="text-2xl">{t("org.title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("org.body")}
              </p>
              <dl className="mt-6 space-y-4 text-sm text-foreground">
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cotto">
                    {t("org.operationalLabel")}
                  </dt>
                  <dd className="mt-0.5">{SITE.orgOperational}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cotto">
                    {t("org.legalLabel")}
                  </dt>
                  <dd className="mt-0.5">{SITE.orgLegal}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cotto">
                    {t("org.pecLabel")}
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${SITE.pec}`}
                      className="transition-colors hover:text-cotto"
                    >
                      {SITE.pec}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cotto">
                    {t("org.hoursLabel")}
                  </dt>
                  <dd className="mt-0.5">{t("org.hours")}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-border/70 shadow-[0_24px_50px_-32px_var(--inchiostro)]">
              <iframe
                src={MAPS_EMBED_URL}
                title={t("map.iframeTitle")}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] w-full border-0"
              />
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-4 rounded-full border-border/80"
            >
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="size-4" aria-hidden="true" />
                {t("map.directions")}
              </a>
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Il territorio: carta illustrata dei Picentini */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{tt("eyebrow")}</p>
            <InkReveal text={tt("title")} className="mt-3 text-3xl sm:text-4xl" />
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {tt("body")}
            </p>
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <TerritoryMap />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
