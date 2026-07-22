"use client";

import { useTranslations } from "next-intl";

import PropertyUnitCardFooter from "@/features/property-units/components/property-unit-card-footer";
import PropertyUnitCardHeader from "@/features/property-units/components/property-unit-card-header";
import PropertyUnitDetailRow from "@/features/property-units/components/property-unit-detail-row";
import {
  PROPERTY_UNIT_DETAIL_FIELDS,
  type PropertyUnitCardData,
  type PropertyUnitDetailField,
} from "@/features/property-units/types/property-unit";
import { cn } from "@/lib/utils";

type PropertyUnitCardProps = {
  unit: PropertyUnitCardData;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  isStarting: boolean;
  onCreateContract: (unit: PropertyUnitCardData) => void;
};

export default function PropertyUnitCard({
  unit,
  selected,
  onSelectedChange,
  isStarting,
  onCreateContract,
}: PropertyUnitCardProps) {
  const tFields = useTranslations("propertyUnits.card.fields");

  return (
    <article
      className={cn(
        "rounded-[40px] border bg-white p-5 shadow-sm transition-colors md:p-6",
        selected ? "border-brand" : "border-[#ececec]",
      )}
    >
      <PropertyUnitCardHeader
        unit={unit}
        selected={selected}
        onSelectedChange={onSelectedChange}
      />

      <div className="border-t border-[#f0f0f0]">
        {PROPERTY_UNIT_DETAIL_FIELDS.map((field) => (
          <PropertyUnitDetailRow
            key={`${unit.id}-${field}`}
            label={tFields(field)}
            value={unit.details[field as PropertyUnitDetailField]}
          />
        ))}
      </div>

      <PropertyUnitCardFooter
        unit={unit}
        isStarting={isStarting}
        onCreateContract={onCreateContract}
      />
    </article>
  );
}
