import type { Locale } from "@/i18n/routing";

/**
 * Base URL pubblica del sito (per canonical, sitemap, OG, JSON-LD).
 * Cascata: NEXT_PUBLIC_SITE_URL esplicita (dominio definitivo) →
 * URL di produzione fornito da Vercel (senza protocollo) → localhost.
 * Solo lato server: qui process.env è sempre disponibile.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

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
