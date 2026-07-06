import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ArchColonnade } from "@/components/arch-motif";
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

          {/* Map placeholder */}
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-border/70 bg-salvia-soft">
            <ArchColonnade
              count={6}
              className="absolute bottom-0 left-0 h-40 w-full text-salvia/40"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <MapPin className="size-7 text-salvia-foreground" aria-hidden="true" />
              <p className="px-6 text-sm text-salvia-foreground">
                {t("map.placeholder")}
              </p>
              <p className="font-serif text-2xl text-foreground">
                {SITE.locality}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
