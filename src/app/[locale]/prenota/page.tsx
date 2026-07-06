import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ArchPlaceholder } from "@/components/arch-motif";
import type { Locale } from "@/i18n/routing";

export default async function PrenotaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("prenota");

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-t-[8rem] rounded-b-2xl ring-1 ring-border/70 lg:order-1">
            <ArchPlaceholder tone="salvia" label={t("comingSoon.imageAlt")} />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl">{t("comingSoon.title")}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {t("comingSoon.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="/contatti">{t("contactCta")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border/80 px-7"
              >
                <Link href="/">{t("backHome")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
