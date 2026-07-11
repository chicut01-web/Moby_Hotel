"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (authError) {
      setError(t("error"));
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="admin-email">{t("emailLabel")}</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="admin-password">{t("passwordLabel")}</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
