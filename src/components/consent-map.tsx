"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArchColonnade } from "@/components/arch-motif";

/**
 * La mappa di Google, ma non prima che qualcuno la chieda.
 *
 * Un iframe di Google contatta i suoi server appena la pagina si apre e
 * può depositare cookie di terze parti, cioè prima e a prescindere da
 * qualsiasi consenso. Qui resta un'anteprima disegnata in casa: finché
 * non si tocca il pulsante non parte nessuna richiesta verso Google.
 * Chi non vuole collegarsi ha comunque il pulsante delle indicazioni,
 * che apre Maps solo su sua azione esplicita.
 */
export function ConsentMap({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const t = useTranslations("contatti.map");
  const [carica, setCarica] = useState(false);

  if (carica) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full border-0"
      />
    );
  }

  return (
    <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-salvia-soft/50 to-calce px-6 text-center">
      <ArchColonnade
        count={5}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-salvia/25"
      />
      <MapPin className="size-6 text-cotto" aria-hidden="true" />
      <div className="relative">
        <p className="font-serif text-xl">{t("consentTitle")}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-salvia">
          {t("consentBody")}
        </p>
      </div>
      <Button
        type="button"
        onClick={() => setCarica(true)}
        className="relative rounded-full px-5"
      >
        {t("consentButton")}
      </Button>
    </div>
  );
}
