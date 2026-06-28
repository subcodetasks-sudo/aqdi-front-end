"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function ProfileDeleteAccountButton() {
  const t = useTranslations("auth.profile");

  function handleClick() {
    toast.error(t("deleteAccountUnavailable"));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mx-auto flex items-center gap-2 text-sm font-semibold text-destructive transition-opacity hover:opacity-80"
    >
      <Trash2 className="size-4" aria-hidden="true" />
      {t("deleteAccount")}
    </button>
  );
}
