import { getTranslations } from "next-intl/server";

import { getUnitTypes } from "@/features/create-unit/services/get-unit-types";
import { getUnitUsageOptions } from "@/features/create-unit/services/get-unit-usage";
import {
  parseUnitContractType,
  parseUnitPropertyId,
} from "@/features/create-unit/utils/contract-type";
import PropertyUnitsPageContent from "@/features/property-units/components/property-units-page-content";
import { getPropertyUnits } from "@/features/property-units/services/get-property-units";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";
import type { PropertyUnitsLabels } from "@/features/property-units/types/property-units-labels";
import { mapPropertyUnitsToCards } from "@/features/property-units/utils/map-property-units";

type PropertyUnitsPageProps = {
  searchParams: Promise<{
    propertyId?: string;
    contract_type?: string;
    type?: string;
  }>;
};

export default async function PropertyUnitsPage({
  searchParams,
}: PropertyUnitsPageProps) {
  const params = await searchParams;
  const propertyId = parseUnitPropertyId(params.propertyId);
  const contractType = parseUnitContractType(params.contract_type, params.type);
  const initialTab = contractType === "commercial" ? "commercial" : "residential";
  const t = await getTranslations("propertyUnits");

  const labels: PropertyUnitsLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    emptyState: t("emptyState"),
    tabs: {
      residential: t("tabs.residential"),
      commercial: t("tabs.commercial"),
    },
  };

  let residentialItems: PropertyUnitCardData[] = [];
  let commercialItems: PropertyUnitCardData[] = [];
  let propertyName: string | null = null;
  let property: PropertyWithUnitsApiData | null = null;

  if (propertyId) {
    try {
      property = await getPropertyUnits(propertyId);
      const fallbackContractType =
        property.contract_type === "commercial" ||
        property.contract_type === "housing"
          ? property.contract_type
          : contractType;

      const [
        housingTypes,
        housingUsages,
        commercialTypes,
        commercialUsages,
      ] = await Promise.all([
        getUnitTypes("housing"),
        getUnitUsageOptions("housing"),
        getUnitTypes("commercial"),
        getUnitUsageOptions("commercial"),
      ]);

      propertyName = property.name_real_estate?.trim() || null;

      const mapped = mapPropertyUnitsToCards(
        property.units ?? [],
        propertyId,
        fallbackContractType,
        {
          housing: { types: housingTypes, usages: housingUsages },
          commercial: { types: commercialTypes, usages: commercialUsages },
        },
      );

      residentialItems = mapped.residentialItems;
      commercialItems = mapped.commercialItems;
    } catch {
      residentialItems = [];
      commercialItems = [];
      property = null;
    }
  }

  return (
    <PropertyUnitsPageContent
      labels={labels}
      propertyId={propertyId}
      initialTab={initialTab}
      propertyName={propertyName}
      property={property}
      residentialItems={residentialItems}
      commercialItems={commercialItems}
    />
  );
}
