import { getTranslations } from "next-intl/server";

import MyPropertiesPageContent from "@/features/my-properties/components/my-properties-page-content";
import { getMyProperties } from "@/features/my-properties/services/get-my-properties";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";
import type { MyPropertiesLabels } from "@/features/my-properties/types/my-properties-labels";
import { mapRealEstateToCard } from "@/features/my-properties/utils/map-real-estate-to-card";
import type { PropertiesTypeDialogLabels } from "@/features/properties/types/properties-type-dialog-labels";

export default async function MyPropertiesPage() {
  const t = await getTranslations("myProperties");
  const tTypeDialog = await getTranslations("properties.typeDialog");

  const typeDialogLabels: PropertiesTypeDialogLabels = {
    title: tTypeDialog("title"),
    close: tTypeDialog("close"),
    mainTitle: tTypeDialog("mainTitle"),
    subtitle: tTypeDialog("subtitle"),
    iconAlt: tTypeDialog("iconAlt"),
    options: {
      residential: {
        title: tTypeDialog("options.residential.title"),
        description: tTypeDialog("options.residential.description"),
        iconAlt: tTypeDialog("options.residential.iconAlt"),
      },
      commercial: {
        title: tTypeDialog("options.commercial.title"),
        description: tTypeDialog("options.commercial.description"),
        iconAlt: tTypeDialog("options.commercial.iconAlt"),
      },
    },
  };

  const labels: MyPropertiesLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    emptyState: t("emptyState"),
    addProperty: t("addProperty"),
    contractTypes: {
      housing: t("contractTypes.housing"),
      commercial: t("contractTypes.commercial"),
    },
    typeDialogLabels,
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

  return <MyPropertiesPageContent labels={labels} items={items} />;
}
