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

  const [t, propertyLookups] = await Promise.all([
    getTranslations("propertyUnits"),
    propertyId
      ? Promise.all([
          getPropertyUnits(propertyId),
          getUnitTypes("housing"),
          getUnitUsageOptions("housing"),
          getUnitTypes("commercial"),
          getUnitUsageOptions("commercial"),
        ]).catch(() => null)
      : Promise.resolve(null),
  ]);

  let residentialItems: PropertyUnitCardData[] = [];
  let commercialItems: PropertyUnitCardData[] = [];
  let propertyName: string | null = null;
  let property: PropertyWithUnitsApiData | null = null;

  if (propertyLookups && propertyId) {
    const [
      loadedProperty,
      housingTypes,
      housingUsages,
      commercialTypes,
      commercialUsages,
    ] = propertyLookups;
    property = loadedProperty;
    const fallbackContractType =
      property.contract_type === "commercial" ||
      property.contract_type === "housing"
        ? property.contract_type
        : contractType;

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
  }

  const labels: PropertyUnitsLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    pageSubtitle: propertyName
      ? t("pageSubtitleWithName", { propertyName })
      : t("pageSubtitle"),
    emptyResidential: t("emptyResidential"),
    emptyCommercial: t("emptyCommercial"),
    createResidentialUnit: t("createResidentialUnit"),
    createCommercialUnit: t("createCommercialUnit"),
    tabs: {
      residential: t("tabs.residential"),
      commercial: t("tabs.commercial"),
    },
  };

  return (
    <PropertyUnitsPageContent
      labels={labels}
      propertyId={propertyId}
      initialTab={initialTab}
      property={property}
      residentialItems={residentialItems}
      commercialItems={commercialItems}
    />
  );
}
