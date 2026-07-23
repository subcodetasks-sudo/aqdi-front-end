import { getTranslations } from "next-intl/server";

import MyPropertiesPageContent from "@/features/my-properties/components/my-properties-page-content";
import { getMyProperties } from "@/features/my-properties/services/get-my-properties";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";
import type { MyPropertiesLabels } from "@/features/my-properties/types/my-properties-labels";
import { mapRealEstateToCard } from "@/features/my-properties/utils/map-real-estate-to-card";

export default async function MyPropertiesPage() {
  const t = await getTranslations("myProperties");
  const labels: MyPropertiesLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    pageBadge: t("pageBadge"),
    propertiesCountLabel: "",
    emptyStateTitle: t("emptyStateTitle"),
    emptyStateDescription: t("emptyStateDescription"),
    addProperty: t("addProperty"),
    contractTypes: {
      housing: t("contractTypes.housing"),
      commercial: t("contractTypes.commercial"),
    },
  };

  let items: MyPropertyCardData[] = [];

  try {
    const properties = await getMyProperties();
    items = properties.map((property) =>
      mapRealEstateToCard(property, labels.contractTypes),
    );
  } catch {
    items = [];
  }

  labels.propertiesCountLabel = t("propertiesCount", { count: items.length });

  return <MyPropertiesPageContent labels={labels} items={items} />;
}
