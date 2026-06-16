import { getTranslations } from "next-intl/server";

import AboutCoreValueItem from "@/features/about/components/about-core-value-item";

type CoreValueItem = {
  id: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
};

export default async function AboutCoreValuesSection() {
  const t = await getTranslations("about.coreValues");
  const items = t.raw("items") as CoreValueItem[];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container space-y-12 md:space-y-16">
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="shrink-0 space-y-4">
            <span className="inline-flex items-center rounded-full border bg-brand-background-green px-4 py-1.5 text-sm font-bold text-foreground">
              {t("badge")}
            </span>
            <h2 className="text-4xl font-extrabold leading-tight text-brand md:text-5xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-8 text-foreground/70 md:pt-10 md:text-base">
            {t("description")}
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-gray-300/10">
          {items.map((item) => (
            <AboutCoreValueItem
              key={item.id}
              icon={item.icon}
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
