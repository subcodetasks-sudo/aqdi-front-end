import { getTranslations } from "next-intl/server";

import PropertiesHeader from "@/features/properties/components/properties-header";
import PropertiesHeroContent from "@/features/properties/components/properties-hero-content";
import PropertiesVisual from "@/features/properties/components/properties-visual";

export default async function PropertiesPage() {
  const t = await getTranslations("properties");

  return (
    <section className="container py-8 lg:py-12">
      <PropertiesHeader
        backLabel={t("backLabel")}
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
    </section>
  );
}
