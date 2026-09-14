import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";
import { InkReveal } from "@/components/ink-reveal";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const TAPPE = [
  { key: "rotta", num: "01", posto: "" },
  { key: "orizzonti", num: "02", posto: "md:ml-auto" },
  { key: "persone", num: "03", posto: "" },
] as const;

/**
 * Il manifesto nelle tre frasi del manuale del logo HEY!.
 *
 * Prima era una traversata orizzontale — barca, rotta tratteggiata, costa
 * in parallasse. Con il nuovo stile gli elementi marini sono usciti e
 * restano le parole, impaginate come nel manuale: titolo pieno in Inter,
 * poche righe sotto, e gli archi del convento sul fondo.
 */
export function Manifesto() {
  const t = useTranslations("home.manifesto");

  return (
    <section
      aria-labelledby="manifesto-heading"
      className="relative overflow-hidden bg-cielo pt-20 pb-48 sm:pt-28 sm:pb-52"
    >
      <ArchColonnade
        count={4}
        className="pointer-events-none absolute bottom-0 left-1/2 h-36 w-80 max-w-none -translate-x-1/2 text-carta sm:h-40 sm:w-[26rem]"
      />
      <Container className="relative">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 id="manifesto-heading" className="sr-only">
          {t("title")}
        </h2>
        <div className="mt-10 space-y-20 sm:space-y-28">
          {TAPPE.map(({ key, num, posto }) => (
            <article key={key} className={cn("max-w-3xl", posto)}>
              <span
                aria-hidden="true"
                className="text-sm font-black tracking-[0.2em] text-blu-testo"
              >
                {num}
              </span>
              <InkReveal
                as="h3"
                text={t(`cards.${key}.title`)}
                className="mt-4 text-[clamp(2.1rem,5vw,4.2rem)] leading-[1.02]"
              />
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-blu-scuro sm:text-xl">
                  {t(`cards.${key}.body`)}
                </p>
              </Reveal>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
