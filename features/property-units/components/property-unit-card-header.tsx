"use client";

import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";
import PropertyUnitDeleteButton from "@/features/property-units/components/property-unit-delete-button";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";
import { cn } from "@/lib/utils";

type PropertyUnitCardHeaderProps = {
  unit: Pick<
    PropertyUnitCardData,
    "unitId" | "unitNumber" | "category" | "propertyId" | "contractType"
  >;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
};

export default function PropertyUnitCardHeader({
  unit,
  selected = false,
  onSelectedChange,
}: PropertyUnitCardHeaderProps) {
  const t = useTranslations("propertyUnits.card");

  const categoryLabel =
    unit.category === "residential"
      ? t("categoryResidential")
      : t("categoryCommercial");

  return (
    <div className="flex items-start justify-between gap-3 border-b border-dashed border-[#ececec] pb-4">
      <div className="flex min-w-0 items-start gap-3">
        {onSelectedChange ? (
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectedChange(checked === true)}
            aria-label={t("selectUnit", { number: unit.unitNumber })}
            className={cn(
              "mt-1 size-5 rounded-md border-[#cfcfcf]",
              "data-checked:border-brand data-checked:bg-brand",
            )}
          />
        ) : null}

        <div className="text-start">
          <p className="text-xs text-muted-foreground">{t("unitNumberLabel")}</p>
          <p className="text-xl font-extrabold text-brand md:text-2xl">
            #{unit.unitNumber}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="rounded-full bg-[#eaf5f2] px-3 py-1.5 text-[11px] font-bold text-brand">
          {categoryLabel}
        </span>

        <Link
          href={`/properties/create-unit?propertyId=${unit.propertyId}&contract_type=${unit.contractType}&unitId=${unit.unitId}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf5f2] px-3 py-1.5 text-[11px] font-bold text-brand transition-colors hover:bg-[#dff0eb]"
        >
          <SquarePen className="size-3.5" aria-hidden="true" />
          {t("editUnit")}
        </Link>

        <PropertyUnitDeleteButton unitId={unit.unitId} />
      </div>
    </div>
  );
}
