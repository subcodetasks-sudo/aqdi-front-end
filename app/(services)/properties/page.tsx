import { getTranslations } from "next-intl/server";

import PropertiesHeader from "@/features/properties/components/properties-header";
import PropertiesHeroContent from "@/features/properties/components/properties-hero-content";
import PropertiesVisual from "@/features/properties/components/properties-visual";
import type { PropertiesTypeDialogLabels } from "@/features/properties/types/properties-type-dialog-labels";

export default async function PropertiesPage() {
  const t = await getTranslations("properties");

  const typeDialogLabels: PropertiesTypeDialogLabels = {
    title: t("typeDialog.title"),
    close: t("typeDialog.close"),
    mainTitle: t("typeDialog.mainTitle"),
    subtitle: t("typeDialog.subtitle"),
    iconAlt: t("typeDialog.iconAlt"),
    options: {
      residential: {
        title: t("typeDialog.options.residential.title"),
        description: t("typeDialog.options.residential.description"),
        iconAlt: t("typeDialog.options.residential.iconAlt"),
      },
      commercial: {
        title: t("typeDialog.options.commercial.title"),
        description: t("typeDialog.options.commercial.description"),
        iconAlt: t("typeDialog.options.commercial.iconAlt"),
      },
    },
  };

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
          typeDialogLabels={typeDialogLabels}
        />
        <PropertiesVisual alt={t("visualAlt")} />
      </div>
    </section>
  );
}
