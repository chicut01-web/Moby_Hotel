import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";
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
    namespace: "metadata.pages.privacy",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: pageAlternates("/privacy", locale),
  };
}

/** Blocco di testo con titolo: la pagina è tutta di questa forma. */
function Sezione({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="border-t border-border/60 py-10">
        <h2 className="font-serif text-2xl leading-tight sm:text-3xl">
          {title}
        </h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-salvia">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  const raccolti = t.raw("collected.formItems") as string[];
  const fornitori = t.raw("processors.items") as string[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("intro")} />

      <Container className="pb-24">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-pietra">{t("updated")}</p>

          <Sezione title={t("controller.title")}>
            <p>{t("controller.body")}</p>
            <dl className="grid gap-3 rounded-2xl border border-border/70 bg-card/60 p-5 text-base sm:grid-cols-2">
              <div>
                <dt className="text-sm text-pietra">
                  {t("controller.legal")}
                </dt>
                <dd className="mt-1">{SITE.orgLegal}</dd>
              </div>
              <div>
                <dt className="text-sm text-pietra">
                  {t("controller.operational")}
                </dt>
                <dd className="mt-1">{SITE.orgOperational}</dd>
              </div>
            </dl>
            <p>
              {t("controller.contact")}{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-cotto underline underline-offset-4 coarse:inline-flex coarse:min-h-11 coarse:items-center"
              >
                {SITE.email}
              </a>{" "}
              — PEC{" "}
              <a
                href={`mailto:${SITE.pec}`}
                className="text-cotto underline underline-offset-4 coarse:inline-flex coarse:min-h-11 coarse:items-center"
              >
                {SITE.pec}
              </a>
              .
            </p>
          </Sezione>

          <Sezione title={t("collected.title")}>
            <p>{t("collected.body")}</p>
            <h3 className="pt-2 font-serif text-xl text-foreground">
              {t("collected.formTitle")}
            </h3>
            <ul className="space-y-2">
              {raccolti.map((voce) => (
                <li key={voce} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cotto" />
                  <span>{voce}</span>
                </li>
              ))}
            </ul>
            <p>{t("collected.note")}</p>
          </Sezione>

          <Sezione title={t("purpose.title")}>
            <p>{t("purpose.body")}</p>
            <p>{t("purpose.noMarketing")}</p>
          </Sezione>

          <Sezione title={t("retention.title")}>
            <p>{t("retention.body")}</p>
          </Sezione>

          <Sezione title={t("processors.title")}>
            <p>{t("processors.body")}</p>
            <ul className="space-y-2">
              {fornitori.map((voce) => (
                <li key={voce} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-salvia" />
                  <span>{voce}</span>
                </li>
              ))}
            </ul>
            <p>{t("processors.note")}</p>
          </Sezione>

          <Sezione title={t("cookies.title")}>
            <p>{t("cookies.body")}</p>
            <h3 className="pt-2 font-serif text-xl text-foreground">
              {t("cookies.mapsTitle")}
            </h3>
            <p>{t("cookies.mapsBody")}</p>
          </Sezione>

          <Sezione title={t("rights.title")}>
            <p>{t("rights.body")}</p>
          </Sezione>
        </div>
      </Container>
    </>
  );
}
