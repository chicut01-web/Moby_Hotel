import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ArchColonnade } from "@/components/arch-motif";
import { BookingForm, type BookingRoomOption } from "@/components/booking-form";
import { getActiveRooms } from "@/lib/rooms";
import { SITE } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export default async function PrenotaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ room?: string }>;
}) {
  const { locale } = await params;
  const { room } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("prenota");
  const tc = await getTranslations("contatti");

  const rooms: BookingRoomOption[] = (await getActiveRooms()).map((r) => ({
    id: r.id,
    name: locale === "en" ? r.name_en : r.name_it,
    capacity: r.capacity,
  }));

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <BookingForm rooms={rooms} preselectedRoomId={room} />

          <aside className="lg:pt-2">
            {/* Video ambientale: corridoio voltato (decorativo) */}
            <div className="relative mb-6 hidden aspect-[3/4] overflow-hidden rounded-t-[7rem] rounded-b-2xl ring-1 ring-border/70 lg:block">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/images/corridoio.mp4"
                poster="/images/corridoio-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-7">
              <h2 className="text-lg">{tc("how.title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {tc("how.body")}
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cotto">
                    {tc("info.emailLabel")}
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="transition-colors hover:text-cotto"
                    >
                      {SITE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-cotto">
                    {tc("info.phoneLabel")}
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${SITE.phoneHref}`}
                      className="transition-colors hover:text-cotto"
                    >
                      {SITE.phone}
                    </a>
                  </dd>
                </div>
              </dl>
              <ArchColonnade
                count={4}
                className="mt-7 h-10 w-36 text-salvia/50"
              />
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
