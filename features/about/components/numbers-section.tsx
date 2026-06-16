import { getTranslations } from "next-intl/server";

import NumbersHeader from "@/features/about/components/numbers-header";
import NumbersStatCard from "@/features/about/components/numbers-stat-card";
import { numbersStatsConfig } from "@/features/about/data/numbers-stats";
import type {
  NumberStatId,
  NumberStatTranslations,
} from "@/features/about/types/number-stat";

export default async function NumbersSection() {
  const t = await getTranslations("about.numbers");
  const items = t.raw("items") as Record<NumberStatId, NumberStatTranslations>;

  return (
    <section className="py-16 md:py-20">
      <div className="container space-y-10 md:space-y-12">
        <NumbersHeader
          badge={t("badge")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {numbersStatsConfig.map((stat) => {
            const copy = items[stat.id];

            return (
              <NumbersStatCard
                key={stat.id}
                icon={stat.icon}
                value={copy.value}
                label={copy.label}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
