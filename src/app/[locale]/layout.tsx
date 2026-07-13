import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Mulish } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MapCursorTrail } from "@/components/map-cursor-trail";
import { ScrollRouteProgress } from "@/components/scroll-route-progress";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="bg-calce-texture flex min-h-full flex-col">
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="contenuto" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MapCursorTrail />
          <ScrollRouteProgress />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
