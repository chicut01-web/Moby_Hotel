import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, pageAlternates } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageFade } from "@/components/page-fade";
import { StructuredData } from "@/components/structured-data";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

/**
 * Inter per l'intero sito: lo stesso carattere dei manifesti e del payoff
 * del logo HEY!. È variabile: un solo file porta tutti i pesi (da Regular 400 a Black 900).
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Su telefono la barra del browser si tinge di `themeColor`: senza,
 * resta grigia sopra il bianco del sito e si vede lo stacco.
 */
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: pageAlternates("", locale as Locale),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="contenuto" className="flex-1">
            <PageFade>{children}</PageFade>
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
