import { getTranslations } from "next-intl/server";

import PropertiesHeroContent from "@/features/properties/components/properties-hero-content";
import PropertiesVisual from "@/features/properties/components/properties-visual";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";

export default async function PropertiesPage() {
  const t = await getTranslations("properties");

  return (
    <>
      <ServicesPageBackConfig
        backLabel={t("backLabel")}
        backHref="/"
        pageTitle={t("pageTitle")}
      />

      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
        <PropertiesHeroContent
          badge={t("badge")}
          titleAccent={t("titleAccent")}
          titleMain={t("titleMain")}
          description={t("description")}
          cta={t("cta")}
        />
        <PropertiesVisual alt={t("visualAlt")} />
      </div>
    </>
  );
}
