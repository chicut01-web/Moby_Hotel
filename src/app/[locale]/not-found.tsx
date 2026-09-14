import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";

/**
 * 404 di brand: gli archi del chiostro e la strada per tornare a casa. Attivata dal catch-all [...rest] per i percorsi inesistenti.
 */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="py-24 sm:py-32">
      <Container className="flex flex-col items-center text-center">
        <ArchColonnade count={4} className="h-24 w-44 text-blu sm:h-28 sm:w-52" />
        <p className="eyebrow mt-10">404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{t("title")}</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
          {t("body")}
        </p>
        <Button asChild size="lg" className="btn-shine mt-9 rounded-full px-7">
          <Link href="/">{t("cta")}</Link>
        </Button>
      </Container>
    </section>
  );
}
