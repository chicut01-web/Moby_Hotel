"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("language");
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn("flex items-center gap-0.5", className)}
    >
      {routing.locales.map((loc) => {
        const isActive = loc === active;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-pietra hover:text-foreground",
            )}
          >
            <span className="sr-only">{t(loc)}</span>
            <span aria-hidden="true">{loc}</span>
          </button>
        );
      })}
    </div>
  );
}
