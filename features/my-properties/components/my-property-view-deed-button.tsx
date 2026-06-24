"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import MyPropertyDeedDialog from "@/features/my-properties/components/my-property-deed-dialog";

export default function MyPropertyViewDeedButton() {
  const t = useTranslations("myProperties.card");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f9f9] px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-[#e4f2ef]"
      >
        {t("viewDeed")}
        👁️
      </button>

      <MyPropertyDeedDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
