import Image from "next/image";
import { useTranslations } from "next-intl";
import { Accessibility, BedDouble, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roomCoverImage } from "@/lib/room-images";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { Room } from "@/lib/types";

export function RoomCard({ room, locale }: { room: Room; locale: Locale }) {
  const t = useTranslations("camere");
  const name = locale === "en" ? room.name_en : room.name_it;
  const description =
    locale === "en" ? room.description_en : room.description_it;
  const price = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(room.price_per_night);
  const cover = roomCoverImage(room);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-cotto/40 hover:shadow-[0_18px_40px_-24px_var(--cotto)]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={cover}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="secondary"
            className="rounded-full font-normal tracking-wide"
          >
            {t(`types.${room.type}`)}
          </Badge>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">{t("card.from")} </span>
            <span className="font-serif text-lg text-foreground">{price}</span>
            <span className="text-xs"> {t("card.perNight")}</span>
          </p>
        </div>

        <h3 className="mt-3 text-xl">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-pietra">
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
              className={cn("inline-flex items-center gap-1.5 text-salvia")}
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
            className="h-auto px-0 text-cotto hover:bg-transparent hover:text-cotto/80"
          >
            <Link href={{ pathname: "/prenota", query: { room: room.id } }}>
              {t("card.request")}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                &rarr;
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
