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
  propertyName: string | null;
  property: PropertyWithUnitsApiData | null;
  residentialItems: PropertyUnitCardData[];
  commercialItems: PropertyUnitCardData[];
};

function buildCreateUnitHref(
  propertyId: number,
  contractType: "housing" | "commercial",
) {
  const params = new URLSearchParams({
    propertyId: String(propertyId),
    contract_type: contractType,
  });

  return `/properties/create-unit?${params.toString()}`;
}

export default function PropertyUnitsPageContent({
  labels,
  propertyId,
  initialTab,
  propertyName,
  property,
  residentialItems,
  commercialItems,
}: PropertyUnitsPageContentProps) {
  const { activeTab, selectTab } = usePropertyUnitsTabs(initialTab);

  const pageTitle = propertyName
    ? `${labels.pageTitle} - ${propertyName}`
    : labels.pageTitle;

  const isResidential = activeTab === "residential";
  const pageBadge = isResidential
    ? labels.residentialUnitsCount
    : labels.commercialUnitsCount;
  const createUnitLabel = isResidential
    ? labels.createResidentialUnit
    : labels.createCommercialUnit;
  const createUnitHref =
    propertyId !== null
      ? buildCreateUnitHref(
          propertyId,
          isResidential ? "housing" : "commercial",
        )
      : null;

  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        backHref="/properties/my-properties"
        pageTitle={pageTitle}
        pageBadge={pageBadge}
        pageAction={
          createUnitHref
            ? {
                label: createUnitLabel,
                href: createUnitHref,
              }
            : undefined
        }
      />

      <PropertyUnitsTabs
        labels={labels}
        propertyId={propertyId}
        activeTab={activeTab}
        onTabChange={selectTab}
        property={property}
        residentialItems={residentialItems}
        commercialItems={commercialItems}
      />
    </>
  );
}
