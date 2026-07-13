import { getFormatter, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import {
  LogoutButton,
  RequestActions,
} from "@/components/admin/request-actions";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

type AdminRequest = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  num_guests: number;
  message: string | null;
  status: "pending" | "confirmed" | "declined";
  locale: string;
  created_at: string;
  rooms: { name_it: string; name_en: string } | null;
};

const statusStyles: Record<AdminRequest["status"], string> = {
  pending: "bg-ocra/15 text-ocra-foreground border-ocra/30",
  confirmed: "bg-salvia-soft text-salvia-foreground border-salvia/30",
  declined: "bg-destructive/10 text-destructive border-destructive/25",
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect({ href: "/admin/login", locale });
  }

  const t = await getTranslations("admin.dashboard");
  const format = await getFormatter();

  const { data, error } = await supabase
    .from("booking_requests")
    .select("*, rooms(name_it, name_en)")
    .order("created_at", { ascending: false });

  const requests = (error ? [] : (data ?? [])) as AdminRequest[];

  const fmtDate = (iso: string) =>
    format.dateTime(new Date(iso + "T00:00:00"), {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t("title")}</p>
            <h1 className="mt-3 text-3xl sm:text-4xl">{t("subtitle")}</h1>
          </div>
          <LogoutButton />
        </div>

        {requests.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/60 px-8 py-16 text-center text-muted-foreground">
            {t("empty")}
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {requests.map((r) => {
              const roomName =
                (r.locale === "en" ? r.rooms?.name_en : r.rooms?.name_it) ??
                r.rooms?.name_it ??
                t("noRoom");
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border border-border/70 bg-card p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg">{r.guest_name}</h2>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full font-normal",
                            statusStyles[r.status],
                          )}
                        >
                          {t(`status.${r.status}`)}
                        </Badge>
                        <span className="text-xs uppercase tracking-wide text-pietra">
                          {r.locale}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {roomName}
                        </span>{" "}
                        · {fmtDate(r.check_in)} → {fmtDate(r.check_out)} ·{" "}
                        {t("guests", { count: r.num_guests })}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <a
                          href={`mailto:${r.guest_email}`}
                          className="hover:text-cotto"
                        >
                          {r.guest_email}
                        </a>
                        {r.guest_phone ? <> · {r.guest_phone}</> : null}
                      </p>
                      {r.message ? (
                        <p className="mt-3 border-l-2 border-pietra-soft pl-3 text-sm italic text-muted-foreground">
                          «{r.message}»
                        </p>
                      ) : null}
                      <p className="mt-3 text-xs text-pietra">
                        {t("requestedOn")}{" "}
                        {format.dateTime(new Date(r.created_at), {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {r.status === "pending" ? (
                      <RequestActions requestId={r.id} />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}
