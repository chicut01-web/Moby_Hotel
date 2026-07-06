import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "it",
  // IT senza prefisso (/), EN con prefisso (/en).
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
