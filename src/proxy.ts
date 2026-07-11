import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * 1. next-intl gestisce il routing localizzato.
 * 2. @supabase/ssr rinfresca la sessione admin (cookie) se le env sono
 *    presenti: senza refresh qui, i token scaduti farebbero uscire l'admin.
 */
export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    // Tocca la sessione: se il token è scaduto viene rinnovato e riscritto.
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  // Tutto tranne API, asset interni Next/Vercel e file con estensione.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
