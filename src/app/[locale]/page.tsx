import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Accessibility, Columns3, Mountain } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";
import { RoomCard } from "@/components/room-card";
import { WaveDivider } from "@/components/wave-divider";
import { getActiveRooms } from "@/lib/rooms";
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
  const rooms = (await getActiveRooms()).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-calce via-pietra-soft/20 to-calce pt-6">
        <Container className="grid gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p
              className="eyebrow animate-in fade-in slide-in-from-bottom-2 duration-700"
              style={{ animationDelay: "60ms", animationFillMode: "both" }}
            >
              {t("hero.eyebrow")}
            </p>
            <h1
              className="mt-5 text-[2.7rem] leading-[1.02] sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: "120ms", animationFillMode: "both" }}
            >
              {t("hero.title")}{" "}
              <span className="italic text-cotto">{t("hero.titleAccent")}</span>
            </h1>
            <p
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              {t("hero.subtitle")}
            </p>
            <div
              className="mt-9 flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-3 duration-700"
              style={{ animationDelay: "280ms", animationFillMode: "both" }}
            >
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="/prenota">{t("hero.ctaPrimary")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-border/80 px-7"
              >
                <Link href="/convento">{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>

          <div
            className="relative animate-in fade-in duration-1000"
            style={{ animationDelay: "180ms", animationFillMode: "both" }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[11rem] rounded-b-2xl ring-1 ring-border/70 shadow-[0_40px_80px_-50px_var(--cotto)]">
              <Image
                src="/images/chiostro-alto.jpg"
                alt={t("hero.imageAlt")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -left-4 bottom-10 hidden rounded-xl border border-border/70 bg-card/90 px-4 py-3 backdrop-blur sm:block">
              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-cotto">
                {t("hero.imageAlt")}
              </p>
            </div>
          </div>
        </Container>

        <WaveDivider waveColorClass="fill-background" className="translate-y-px" />
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="eyebrow">{t("intro.eyebrow")}</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">{t("intro.title")}</h2>
            <ArchColonnade
              count={4}
              className="mt-7 h-14 w-40 text-salvia/45"
            />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>{t("intro.body1")}</p>
            <p>{t("intro.body2")}</p>
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="pb-8">
        <Container>
          <h2 className="sr-only">{t("highlights.title")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {HIGHLIGHTS.map(({ key, Icon }) => (
              <div
                key={key}
                className="rounded-2xl border border-border/70 bg-card p-7 transition-colors hover:border-salvia/50"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-salvia-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl">
                  {t(`highlights.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`highlights.${key}.body`)}
                </p>
              </div>
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
              <h2 className="mt-3 text-3xl sm:text-4xl">{t("rooms.title")}</h2>
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
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} locale={locale} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="pb-4">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-cotto px-7 py-14 text-cotto-foreground sm:px-14">
            <ArchColonnade
              count={9}
              className="pointer-events-none absolute -bottom-2 right-0 h-44 w-[44rem] max-w-none text-cotto-foreground/15"
            />
            <div className="relative max-w-xl">
              <h2 className="text-3xl text-cotto-foreground sm:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mt-4 leading-relaxed text-cotto-foreground/85">
                {t("cta.body")}
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-calce px-7 text-foreground hover:bg-calce/90"
              >
                <Link href="/prenota">{t("cta.button")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
