import { getTranslations } from "next-intl/server";

import PropertyUnitsPageContent from "@/features/property-units/components/property-units-page-content";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";
import type { PropertyUnitsLabels } from "@/features/property-units/types/property-units-labels";

export default async function PropertyUnitsPage() {
  const t = await getTranslations("propertyUnits");

  const labels: PropertyUnitsLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    tabs: {
      residential: t("tabs.residential"),
      commercial: t("tabs.commercial"),
    },
    residentialItems: t.raw("residentialItems") as PropertyUnitCardData[],
    commercialItems: t.raw("commercialItems") as PropertyUnitCardData[],
  };

  return <PropertyUnitsPageContent labels={labels} />;
}
