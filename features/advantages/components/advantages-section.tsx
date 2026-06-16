import { getTranslations } from "next-intl/server";

import AdvantageCard from "@/features/advantages/components/advantage-card";
import AdvantagesAppDownload from "@/features/advantages/components/advantages-app-download";
import AdvantagesHeader from "@/features/advantages/components/advantages-header";
import { advantageItemsConfig } from "@/features/advantages/data/advantage-items";
import type { AdvantageItemTranslations } from "@/features/advantages/types/advantage";

export default async function AdvantagesSection() {
  const t = await getTranslations("advantages");
  const items = t.raw("items") as Record<string, AdvantageItemTranslations>;

  return (
    <section className="py-16 md:py-20">
      <div className="container space-y-6 md:space-y-14">
        <AdvantagesHeader
          badge={t("badge")}
          titlePrefix={t("titlePrefix")}
          titleAccent={t("titleAccent")}
          titleSuffix={t("titleSuffix")}
          description={t("description")}
        />

        <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border/60 py-6 border-b border-t  border-border/60 ">
          {advantageItemsConfig.map((item) => {
            const copy = items[item.id];

            return (
              <AdvantageCard
                key={item.id}
                title={copy.title}
                description={copy.description}
                icon={item.icon}
                theme={item.theme}
              />
            );
          })}
        </div>

        <AdvantagesAppDownload />
      </div>
    </section>
  );
}
