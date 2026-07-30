"use client";

import PropertyUnitsTabs from "@/features/property-units/components/property-units-tabs";
import { usePropertyUnitsTabs } from "@/features/property-units/hooks/use-property-units-tabs";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type {
  PropertyUnitCardData,
  PropertyUnitTab,
} from "@/features/property-units/types/property-unit";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";
import type { PropertyUnitsLabels } from "@/features/property-units/types/property-units-labels";

type PropertyUnitsPageContentProps = {
  labels: PropertyUnitsLabels;
  propertyId: number | null;
  initialTab: PropertyUnitTab;
  property: PropertyWithUnitsApiData | null;
  residentialItems: PropertyUnitCardData[];
  commercialItems: PropertyUnitCardData[];
};

function buildCreateUnitHref(propertyId: number) {
  const params = new URLSearchParams({
    propertyId: String(propertyId),
  });

  return `/properties/create-unit?${params.toString()}`;
}

export default function PropertyUnitsPageContent({
  labels,
  propertyId,
  initialTab,
  property,
  residentialItems,
  commercialItems,
}: PropertyUnitsPageContentProps) {
  const { activeTab, selectTab } = usePropertyUnitsTabs(initialTab);

  const createUnitLabel = labels.createResidentialUnit;
  const createUnitHref =
    propertyId !== null ? buildCreateUnitHref(propertyId) : null;

  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        backHref="/properties/my-properties"
        pageAction={
          createUnitHref
            ? {
                label: createUnitLabel,
                href: createUnitHref,
              }
            : undefined
        }
      />

      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold text-brand md:text-4xl">
            {labels.pageTitle}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[#7a7a7a] md:text-base">
            {labels.pageSubtitle}
          </p>
        </header>

        <PropertyUnitsTabs
          labels={labels}
          propertyId={propertyId}
          activeTab={activeTab}
          onTabChange={selectTab}
          property={property}
          residentialItems={residentialItems}
          commercialItems={commercialItems}
          createUnitHref={createUnitHref}
        />
      </div>
    </>
  );
}
