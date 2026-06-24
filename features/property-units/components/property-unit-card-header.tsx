"use client";

import { Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";

type PropertyUnitCardHeaderProps = {
  unit: Pick<PropertyUnitCardData, "unitNumber" | "category">;
};

export default function PropertyUnitCardHeader({
  unit,
}: PropertyUnitCardHeaderProps) {
  const t = useTranslations("propertyUnits.card");

  const categoryLabel =
    unit.category === "residential"
      ? t("categoryResidential")
      : t("categoryCommercial");

  return (
    <div className="flex items-start justify-between gap-3 pb-4">
      <div className="text-start">
        <p className="text-xs text-muted-foreground">{t("unitNumberLabel")}</p>
        <p className="text-xl font-extrabold text-brand md:text-2xl">
          {unit.unitNumber}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-full bg-brand-secondary px-3 py-1 text-[11px] font-bold text-white">
          {categoryLabel}
        </span>

        <Link
          href="/properties/create-unit"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-3 py-1.5 text-[11px] font-semibold text-foreground/80 transition-colors hover:bg-[#e8e8e8]"
        >
          <Link2 className="size-3.5" aria-hidden="true" />
          {t("editUnit")}
        </Link>

        <button
          type="button"
          aria-label={t("deleteUnit")}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#e53935] transition-colors hover:bg-red-50"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
