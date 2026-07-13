import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export default async function ContattiPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contatti");

  const items = [
    {
      Icon: MapPin,
      label: t("info.addressLabel"),
      value: SITE.address,
      href: undefined,
    },
    {
      Icon: Phone,
      label: t("info.phoneLabel"),
      value: SITE.phone,
      href: `tel:${SITE.phoneHref}`,
    },
    {
      Icon: Mail,
      label: t("info.emailLabel"),
      value: SITE.email,
      href: `mailto:${SITE.email}`,
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
    </>
  );
}
