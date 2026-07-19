import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

/**
 * Dati strutturati schema.org per i motori di ricerca: la struttura è
 * un ostello (Hostel ⊂ LodgingBusiness) ad Acerno, gestito da Moby Dick
 * ETS. Niente telefono finché non c'è un numero reale.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Hostel",
    name: SITE.name,
    url: SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Centro storico",
      addressLocality: "Acerno",
      postalCode: "84042",
      addressRegion: "SA",
      addressCountry: "IT",
    },
    parentOrganization: {
      "@type": "Organization",
      name: SITE.org,
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.orgOperational,
        addressLocality: "Salerno",
        addressCountry: "IT",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
