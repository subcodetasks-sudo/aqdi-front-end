import { getTranslations } from "next-intl/server";

import TrustedEntitiesHeader from "@/features/home/components/trusted-entities-header";
import TrustedEntityCard from "@/features/home/components/trusted-entity-card";
import { trustedEntitiesConfig } from "@/features/home/data/trusted-entities";

type TrustedEntityTranslation = {
  name: string;
  nameEn: string;
  description: string;
};

export default async function TrustedEntitiesSection() {
  const t = await getTranslations("trustedEntities");
  const entities = t.raw("entities") as Record<string, TrustedEntityTranslation>;

  return (
    <section className="py-16 md:py-20">
      <div className="container flex flex-col gap-10 md:gap-12">
        <TrustedEntitiesHeader
          badge={t("badge")}
          titlePrefix={t("titlePrefix")}
          titleAccent={t("titleAccent")}
          description={t("description")}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {trustedEntitiesConfig.map((entity) => {
            const copy = entities[entity.id];

            return (
              <TrustedEntityCard
                key={entity.id}
                name={copy.name}
                nameEn={copy.nameEn}
                description={copy.description}
                viewLicense={t("viewLicense")}
                licenseUrl={entity.licenseUrl}
                logoSrc={entity.logoSrc}
                theme={entity.theme}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
