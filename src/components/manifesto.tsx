import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { Reveal } from "@/components/reveal";

const TAPPE = [
  { key: "rotta", num: "01" },
  { key: "orizzonti", num: "02" },
  { key: "persone", num: "03" },
] as const;

/**
 * Il manifesto HEY! a tutto schermo sul porticato e colonnato del convento:
 * immagine panoramica in background con sfumatura scura e testi adattati
 * e allineati sulla sinistra per la massima chiarezza e impatto visivo.
 */
export function Manifesto() {
  const t = useTranslations("home.manifesto");

  return (
    <section
      aria-labelledby="manifesto-heading"
      className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-center py-20 sm:py-28 text-white"
    >
      {/* Immagine a tutto schermo */}
      <div className="absolute inset-0">
        <Image
          src="/images/manifesto.jpg"
          alt={t("imageAlt")}
          fill
          priority={false}
          quality={90}
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        {/* Sfumatura sinistra direzionale per contrasto ideale sui testi a sinistra */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-r from-blu-scuro/95 via-blu-scuro/85 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block lg:hidden bg-blu-scuro/80"
        />
        {/* Sfumatura superiore e inferiore per fondere naturalmente con le sezioni adiacenti */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/40 to-transparent"
        />
      </div>

      {/* Testi del manifesto allineati a sinistra */}
      <Container className="relative z-10">
        <div className="max-w-2xl text-left">
          {/* Eyebrow */}
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#9bd2eb] drop-shadow">
            {t("eyebrow")}
          </p>

          <h2 id="manifesto-heading" className="sr-only">
            {t("title")}
          </h2>

          <div className="mt-8 space-y-9 sm:space-y-11">
            {TAPPE.map(({ key, num }, idx) => (
              <Reveal
                key={key}
                delay={idx * 120}
                className="relative pl-6 sm:pl-7 border-l-2 border-[#7ec6e6]/35 hover:border-[#7ec6e6] transition-colors"
              >
                <span
                  aria-hidden="true"
                  className="text-xs sm:text-sm font-black tracking-[0.25em] text-[#7ec6e6]"
                >
                  {num}
                </span>
                <h3 className="mt-1 font-heading text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                  {t(`cards.${key}.title`)}
                </h3>
                <p className="mt-2.5 max-w-xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                  {t(`cards.${key}.body`)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
