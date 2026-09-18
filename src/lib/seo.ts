import type { Locale } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export function pageAlternates(path: string, locale: Locale) {
  const it = path === "" ? "/" : path;
  const en = `/en${path}`;
  return {
    canonical: locale === "en" ? en : it,
    languages: { it, en, "x-default": it },
  };
}
