import Image from "next/image";
import { useTranslations } from "next-intl";
import { Accessibility, ArrowRight, BedDouble, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roomCoverImage } from "@/lib/room-images";
import { ArchColonnade } from "@/components/arch-motif";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { Room } from "@/lib/types";

export function RoomCard({ room, locale }: { room: Room; locale: Locale }) {
  const t = useTranslations("camere");
  const name = locale === "en" ? room.name_en : room.name_it;
  const description =
    locale === "en" ? room.description_en : room.description_it;
  const cover = roomCoverImage(room);

  return (
    <article className="lantern-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="relative aspect-[5/4] overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover transition-[transform,filter] duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
          />
        ) : (

          <div
            aria-hidden="true"
            className="flex h-full w-full items-end justify-center bg-gradient-to-b from-cielo/50 to-carta"
          >
            <ArchColonnade
              count={4}
              className="w-[88%] text-blu/25"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="secondary"
            className="rounded-full font-normal tracking-wide"
          >
            {t(`types.${room.type}`)}
          </Badge>

          <p className="text-xs text-muted-foreground">
            {t("card.onRequest")}
          </p>
        </div>

        <h3 className="mt-3 text-xl">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blu-testo">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden="true" />
            {t("card.guests", { count: room.capacity })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5" aria-hidden="true" />
            {t("card.beds", { count: room.beds })}
          </span>
          {room.is_accessible ? (
            <span
              className={cn("inline-flex items-center gap-1.5 text-blu-testo")}
            >
              <Accessibility className="size-3.5" aria-hidden="true" />
              {t("card.accessible")}
            </span>
          ) : null}
        </div>

        <div className="mt-6 border-t border-border/60 pt-4">
          <Button
            asChild
            variant="ghost"

            className="h-auto coarse:h-11 px-0 text-blu-scuro hover:bg-transparent hover:text-blu-scuro/80"
          >
            <Link
              href={{ pathname: "/prenota", query: { room: room.id } }}
              aria-label={`${t("card.request")} - ${name}`}
            >
              {t("card.request")}
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
