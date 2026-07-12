import PropertyUnitsTabs from "@/features/property-units/components/property-units-tabs";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import type { PropertyUnitCardData, PropertyUnitTab } from "@/features/property-units/types/property-unit";
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

export default function PropertyUnitsPageContent({
  labels,
  propertyId,
  initialTab,
  propertyName,
  property,
  residentialItems,
  commercialItems,
}: PropertyUnitsPageContentProps) {
  const pageTitle = propertyName
    ? `${labels.pageTitle} - ${propertyName}`
    : labels.pageTitle;

  return (
    <>
      <ServicesPageBackConfig
        backLabel={labels.backLabel}
        backHref="/properties/my-properties"
        pageTitle={pageTitle}
      />

      <PropertyUnitsTabs
        labels={labels}
        propertyId={propertyId}
        initialTab={initialTab}
        property={property}
        residentialItems={residentialItems}
        commercialItems={commercialItems}
      />
    </>
  );
}
