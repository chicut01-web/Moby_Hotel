"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmBooking, declineBooking } from "@/app/actions/admin";

export function RequestActions({ requestId }: { requestId: string }) {
  const t = useTranslations("admin.dashboard");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function run(action: (id: string) => Promise<{ ok: boolean }>) {
    setError(false);
    startTransition(async () => {
      const result = await action(requestId);
      if (!result.ok) setError(true);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={pending}
          onClick={() => run(confirmBooking)}
          className="rounded-full bg-salvia text-calce hover:bg-salvia/90"
        >
          <Check className="size-3.5" aria-hidden="true" />
          {t("confirm")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(declineBooking)}
          className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <X className="size-3.5" aria-hidden="true" />
          {t("decline")}
        </Button>
      </div>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {t("actionError")}
        </p>
      ) : null}
    </div>
  );
}

export function LogoutButton() {
  const t = useTranslations("admin.dashboard");
  const [pending, startTransition] = useTransition();

  function onLogout() {
    startTransition(async () => {
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
      window.location.assign("/");
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={onLogout}
      className="rounded-full border-border/80"
    >
      {t("logout")}
    </Button>
  );
}
