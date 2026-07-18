import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Rotte pubbliche (l'italiano è senza prefisso, l'inglese sotto /en). */
const ROUTES = ["", "/convento", "/camere", "/contatti", "/prenota"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => {
    const it = `${SITE_URL}${path === "" ? "/" : path}`;
    const en = `${SITE_URL}/en${path}`;
    return {
      url: it,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: { it, en } },
    };
  });
}
