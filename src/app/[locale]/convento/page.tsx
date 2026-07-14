import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ArchColonnade } from "@/components/arch-motif";
import { GalleryWithLightbox } from "@/components/gallery-with-lightbox";
import { InkReveal } from "@/components/ink-reveal";
import type { Locale } from "@/i18n/routing";

const SPACES = ["pianoTerra", "primoPiano", "seminterrato"] as const;

export default async function ConventoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("convento");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      {/* Story */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
          <div>
            <InkReveal text={t("story.title")} className="text-3xl sm:text-4xl" />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>{t("story.body1")}</p>
              <p>{t("story.body2")}</p>
              <p>{t("story.body3")}</p>
            </div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[9rem] rounded-b-2xl ring-1 ring-border/70">
            <Image
              src="/images/porticato.jpg"
              alt={t("hero.imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Gallery: affreschi + volte (con lightbox) */}
      <section className="pb-4">
        <Container>
          <GalleryWithLightbox
            items={[
              {
                src: "/images/affreschi.jpg",
                alt: t("gallery.affreschiAlt"),
                caption: t("gallery.affreschiCaption"),
              },
              {
                src: "/images/volte.jpg",
                alt: t("gallery.volteAlt"),
                caption: t("gallery.volteCaption"),
              },
            ]}
          />
        </Container>
      </section>

      {/* Spaces */}
      <section className="bg-calce-deep py-16 sm:py-24">
        <Container>
          <div className="max-w-xl">
            <p className="eyebrow">{t("spaces.title")}</p>
            <InkReveal text={t("spaces.intro")} className="mt-3 text-3xl sm:text-4xl" />
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 md:grid-cols-3">
            {SPACES.map((key, i) => (
              <div key={key} className="bg-card p-7">
                <span className="font-serif text-5xl text-salvia/40">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl">{t(`spaces.${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`spaces.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Floor plan */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <ArchColonnade count={5} className="w-full text-pietra/30" />
            </div>
            <span className="absolute left-5 top-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-pietra">
              {t("plan.eyebrow")}
            </span>
          </div>
          <div>
            <p className="eyebrow">{t("plan.eyebrow")}</p>
            <InkReveal text={t("plan.title")} className="mt-3 text-3xl sm:text-4xl" />
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {t("plan.body")}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
