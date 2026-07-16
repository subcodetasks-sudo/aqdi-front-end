import { getTranslations } from "next-intl/server";

import MyPropertiesPageContent from "@/features/my-properties/components/my-properties-page-content";
import { getMyProperties } from "@/features/my-properties/services/get-my-properties";
import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";
import type { MyPropertiesLabels } from "@/features/my-properties/types/my-properties-labels";
import { mapRealEstateToCard } from "@/features/my-properties/utils/map-real-estate-to-card";
import PropertiesHeroContent from "@/features/properties/components/properties-hero-content";
import PropertiesVisual from "@/features/properties/components/properties-visual";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";

export default async function MyPropertiesPage() {
  const t = await getTranslations("myProperties");
  const s = await getTranslations("properties");
  const labels: MyPropertiesLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    emptyState: t("emptyState"),
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

  return <>
  {items.length > 0 ? (
    <MyPropertiesPageContent labels={labels} items={items} />
  ) : (
    <>
    <ServicesPageBackConfig
      backLabel={s("backLabel")}
      backHref="/"
      pageTitle={s("pageTitle")}
    />

    <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
      <PropertiesHeroContent
        badge={s("badge")}
        titleAccent={s("titleAccent")}
        titleMain={s("titleMain")}
        description={s("description")}
        cta={s("cta")}
      />
      <PropertiesVisual alt={s("visualAlt")} />
    </div>
  </>
  )}
  </>
  
}
