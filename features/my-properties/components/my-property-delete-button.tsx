"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MyPropertyDeleteButton() {
  const t = useTranslations("myProperties.card");

  return (
    <button
      type="button"
      aria-label={t("deleteProperty")}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#e53935] transition-colors hover:bg-red-50"
    >
      <Trash2 className="size-4" aria-hidden="true" />
    </button>
  );
}
