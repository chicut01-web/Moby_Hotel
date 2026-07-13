import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { RoomCard } from "@/components/room-card";
import { Reveal } from "@/components/reveal";
import { getActiveRooms } from "@/lib/rooms";
import type { Locale } from "@/i18n/routing";

// ISR: le camere arrivano dal DB, la pagina si rigenera senza rebuild.
export const revalidate = 300;

export default async function CamerePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("camere");
  const tn = await getTranslations("nav");
  const rooms = await getActiveRooms();

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("intro.body")}
          </p>

          {rooms.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, i) => (
                <Reveal key={room.id} delay={(i % 3) * 110} className="h-full">
                  <RoomCard room={room} locale={locale} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/60 px-8 py-16 text-center">
              <h2 className="text-2xl">{t("empty.title")}</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                {t("empty.body")}
              </p>
              <Button asChild className="mt-7 rounded-full">
                <Link href="/contatti">{tn("contatti")}</Link>
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
