import type { Locale } from "@/i18n/routing";

/**
 * Base URL pubblica del sito (per canonical, sitemap, OG). In locale il
 * fallback basta; in produzione va impostata NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Canonical + hreflang per una rotta pubblica. `path` senza locale e senza
 * trailing slash ("" per la home, "/camere", ...): l'italiano è senza
 * prefisso (localePrefix "as-needed"), l'inglese sotto /en.
 */
export function pageAlternates(path: string, locale: Locale) {
  const it = path === "" ? "/" : path;
  const en = `/en${path}`;
  return {
    canonical: locale === "en" ? en : it,
    languages: { it, en, "x-default": it },
  };
}
