import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tutto tranne API, asset interni Next/Vercel e file con estensione.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
