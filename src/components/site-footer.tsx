import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { HeyLogo } from "@/components/hey-logo";
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
    <footer className="mt-24 bg-grigio pt-2">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <HeyLogo className="h-24 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("about.body")}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("explore")}
            </h2>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit coarse:inline-flex coarse:min-h-11 coarse:items-center text-sm text-muted-foreground transition-colors hover:text-blu-scuro"
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
              href={`mailto:${SITE.email}`}
              className="w-fit coarse:inline-flex coarse:min-h-11 coarse:items-center text-sm text-muted-foreground transition-colors hover:text-blu-scuro"
            >
              {SITE.email}
            </a>
            <a
              href={`mailto:${SITE.pec}`}
              className="w-fit coarse:inline-flex coarse:min-h-11 coarse:items-center text-sm text-muted-foreground transition-colors hover:text-blu-scuro"
            >
              PEC: {SITE.pec}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t("org")}. {t("mission")}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href="/privacy"
              className="coarse:inline-flex coarse:min-h-11 coarse:items-center underline underline-offset-4 transition-colors hover:text-blu-scuro"
            >
              {t("privacy")}
            </Link>
            <p>
              © {year} {SITE.org}. {t("rights")}
              <span className="ml-2 font-normal">({t("provisional")})</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
