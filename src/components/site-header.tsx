"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", key: "home" },
  { href: "/convento", key: "convento" },
  { href: "/camere", key: "camere" },
  { href: "/contatti", key: "contatti" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex flex-col leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm"
    >
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cotto">
        Hub for
      </span>
      <span className="font-serif text-xl tracking-tight text-foreground">
        European Youth
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-calce/85 backdrop-blur supports-[backdrop-filter]:bg-calce/70">
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <Container className="flex h-[4.5rem] items-center justify-between gap-4">
        <Brand />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-pietra hover:text-foreground",
              )}
            >
              <span className="relative">
                {t(item.key)}
                {isActive(pathname, item.href) ? (
                  <svg className="absolute -bottom-1.5 left-0 h-1 w-full text-cotto" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : null}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <Button
            asChild
            size="sm"
            className="btn-shine hidden rounded-full px-4 sm:inline-flex"
          >
            <Link href="/prenota">{t("prenota")}</Link>
          </Button>

          {/* Menu mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t("openMenu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-calce p-0">
              <SheetTitle className="border-b border-border/70 p-5">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cotto">
                  Hub for
                </span>
                <span className="block font-serif text-xl">
                  European Youth
                </span>
              </SheetTitle>
              <nav className="flex flex-col p-3" aria-label="Mobile">
                {NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                      className={cn(
                        "rounded-lg px-4 py-3 font-serif text-lg transition-colors",
                        isActive(pathname, item.href)
                          ? "bg-secondary text-secondary-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-4 border-t border-border/70 p-5">
                <SheetClose asChild>
                  <Button asChild className="w-full rounded-full">
                    <Link href="/prenota">{t("prenota")}</Link>
                  </Button>
                </SheetClose>
                <LocaleSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
