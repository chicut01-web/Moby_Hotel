import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { AdminLoginForm } from "@/components/admin/login-form";
import type { Locale } from "@/i18n/routing";

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin.login");

  // Già autenticato → dritto alla dashboard.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect({ href: "/admin", locale });
  }

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-md">
        <p className="eyebrow">{t("title")}</p>
        <h1 className="mt-3 text-3xl">{t("subtitle")}</h1>
        <div className="mt-10 rounded-2xl border border-border/70 bg-card p-7">
          <AdminLoginForm />
        </div>
      </Container>
    </section>
  );
}
