import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AboutBeneficiariesSection from "@/features/about/components/about-beneficiaries-section";
import AboutCoreValuesSection from "@/features/about/components/about-core-values-section";
import AboutValuesSection from "@/features/about/components/about-values-section";
import NumbersSection from "@/features/about/components/numbers-section";
import WhoWeAre from "@/features/about/components/who-we-are";
import { numbersStatsConfig } from "@/features/about/data/numbers-stats";
import { getAboutContent } from "@/features/about/services/get-about-content";
import type {
  NumberStatId,
  NumberStatTranslations,
} from "@/features/about/types/number-stat";
import { resolveAboutContent } from "@/features/about/utils/resolve-about-content";
import SupportSection from "@/features/support/components/support-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");

  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  };
}

export default async function AboutPage() {
  const [apiSections, tWho, tNumbers, tValues, tBeneficiaries, tCoreValues] =
    await Promise.all([
      getAboutContent(),
      getTranslations("about.whoWeAre"),
      getTranslations("about.numbers"),
      getTranslations("about.values"),
      getTranslations("about.beneficiaries"),
      getTranslations("about.coreValues"),
    ]);

  const numberItems = tNumbers.raw("items") as Record<
    NumberStatId,
    NumberStatTranslations
  >;

  const content = resolveAboutContent(apiSections, {
    hero: {
      eyebrow: tWho("eyebrow"),
      titleLine1: tWho("titleLine1"),
      titleLine2: tWho("titleLine2"),
      description: tWho("description"),
    },
    story: {
      badge: tNumbers("badge"),
      title: tNumbers("title"),
      description: tNumbers("description"),
      config: numbersStatsConfig,
      cards: numbersStatsConfig.map((stat) => ({
        id: stat.id,
        icon: stat.icon,
        value: numberItems[stat.id]?.value ?? "",
        label: numberItems[stat.id]?.label ?? "",
      })),
    },
    visionMission: {
      title: tValues("title"),
      description: tValues("description"),
      vision: {
        eyebrow: tValues("vision.eyebrow"),
        title: tValues("vision.title"),
        description: tValues("vision.description"),
        imageSrc: "/images/vision.png",
        imageAlt: tValues("vision.imageAlt"),
      },
      mission: {
        eyebrow: tValues("mission.eyebrow"),
        title: tValues("mission.title"),
        description: tValues("mission.description"),
        imageSrc: "/images/messages.png",
        imageAlt: tValues("mission.imageAlt"),
      },
    },
    beneficiaries: {
      badge: tBeneficiaries("badge"),
      title: tBeneficiaries("title"),
      description: tBeneficiaries("description"),
      cards: tBeneficiaries.raw("items") as Array<{
        id: string;
        icon: string;
        title: string;
        description: string;
      }>,
    },
    coreValues: {
      badge: tCoreValues("badge"),
      title: tCoreValues("title"),
      description: tCoreValues("description"),
      cards: tCoreValues.raw("items") as Array<{
        id: string;
        icon: string;
        eyebrow: string;
        title: string;
        description: string;
      }>,
    },
  });

  return (
    <div>
      <WhoWeAre content={content.hero} />
      <NumbersSection content={content.story} />
      <AboutValuesSection content={content.visionMission} />
      <AboutBeneficiariesSection content={content.beneficiaries} />
      <AboutCoreValuesSection content={content.coreValues} />
      <SupportSection />
    </div>
  );
}
