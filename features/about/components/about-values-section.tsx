import { getTranslations } from "next-intl/server";

import AboutValuesItem from "@/features/about/components/about-values-item";

export default async function AboutValuesSection() {
  const t = await getTranslations("about.values");

  return (
    <section className="py-16 md:py-24">
      <div className="container space-y-12 md:space-y-16">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-sm leading-8 text-muted-foreground md:text-base">
            {t("description")}
          </p>
        </header>

        <AboutValuesItem
          eyebrow={t("vision.eyebrow")}
          title={t("vision.title")}
          description={t("vision.description")}
          imageSrc="/images/vision.png"
          imageAlt={t("vision.imageAlt")}
        />

        <AboutValuesItem
          eyebrow={t("mission.eyebrow")}
          title={t("mission.title")}
          description={t("mission.description")}
          imageSrc="/images/messages.png"
          imageAlt={t("mission.imageAlt")}
          reverse
        />
      </div>
    </section>
  );
}
