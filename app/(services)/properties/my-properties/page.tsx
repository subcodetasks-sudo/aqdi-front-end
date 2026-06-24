import { getTranslations } from "next-intl/server";

import MyPropertiesPageContent from "@/features/my-properties/components/my-properties-page-content";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";
import type { MyPropertiesLabels } from "@/features/my-properties/types/my-properties-labels";

export default async function MyPropertiesPage() {
  const t = await getTranslations("myProperties");

  const labels: MyPropertiesLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    items: t.raw("items") as MyPropertyCardData[],
  };

  return <MyPropertiesPageContent labels={labels} />;
}
