import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { ArchColonnade } from "@/components/arch-motif";
import { WaveDivider } from "@/components/wave-divider";
import { Whale } from "@/components/whale";
import { Bubbles } from "@/components/bubbles";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/convento", key: "convento" },
  { href: "/camere", key: "camere" },
  { href: "/contatti", key: "contatti" },
  { href: "/prenota", key: "prenota" },
] as const;

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-calce-deep">
      <WaveDivider flipped={true} waveColorClass="fill-calce-deep" className="-translate-y-px" />
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cotto">
              Hub for
            </span>
            <p className="mt-1 font-serif text-2xl">European Youth</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("about.body")}
            </p>
            <div className="relative mt-6 flex items-end gap-5">
              <ArchColonnade count={5} className="h-12 w-44 text-salvia/60" />
              <Bubbles className="inset-y-0 right-0 w-24" />
              <Whale className="relative w-20" />
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("explore")}
            </h2>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-cotto"
              >
                {tn(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("contact")}
            </h2>
            <p className="text-sm text-muted-foreground">{SITE.address}</p>
            <a
              href={`tel:${SITE.phoneHref}`}
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-cotto"
            >
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="w-fit text-sm text-muted-foreground transition-colors hover:text-cotto"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t("org")}. {t("mission")}
          </p>
          <p>
            © {year} {SITE.org}. {t("rights")}
            <span className="ml-2 opacity-70">{t("provisional")}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
