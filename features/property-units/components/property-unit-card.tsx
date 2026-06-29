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

type PropertyUnitCardProps = {
  unit: PropertyUnitCardData;
};

export default function PropertyUnitCard({ unit }: PropertyUnitCardProps) {
  const tFields = useTranslations("propertyUnits.card.fields");

  return (
    <article className="rounded-[40px] border border-[#ececec] bg-white p-5 shadow-sm md:p-6">
      <PropertyUnitCardHeader unit={unit} />

      <div className="border-t border-[#f0f0f0]">
        {PROPERTY_UNIT_DETAIL_FIELDS.map((field) => (
          <PropertyUnitDetailRow
            key={`${unit.id}-${field}`}
            label={tFields(field)}
            value={unit.details[field as PropertyUnitDetailField]}
          />
        ))}
      </div>

      <PropertyUnitCardFooter unit={unit} />
    </article>
  );
}
