import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AppSection from "@/features/app/components/app-section";
import AdvantagesSection from "@/features/advantages/components/advantages-section";
import { advantageItemsConfig } from "@/features/advantages/data/advantage-items";
import type { AdvantageItemTranslations } from "@/features/advantages/types/advantage";
import FaqSectionBoundary from "@/features/faq/components/faq-section-boundary";
import HeroSection from "@/features/home/components/hero-section";
import TrustedEntitiesSection from "@/features/home/components/trusted-entities-section";
import { trustedEntitiesConfig } from "@/features/home/data/trusted-entities";
import { getHomeContent } from "@/features/home/services/get-home-content";
import { resolveHomeContent } from "@/features/home/utils/resolve-home-content";
import PricingSection from "@/features/pricing/components/pricing-section";
import ServicesSection from "@/features/services/components/services-section";
import SupportSection from "@/features/support/components/support-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");

  return {
    description: t("metaDescription"),
  };
}

export default async function Home() {
  const [apiSections, tHero, tTrusted, tAdvantages, tPricing, tSupport, tApp] =
    await Promise.all([
      getHomeContent(),
      getTranslations("hero"),
      getTranslations("trustedEntities"),
      getTranslations("advantages"),
      getTranslations("pricing"),
      getTranslations("support"),
      getTranslations("appSection"),
    ]);

  const content = resolveHomeContent(apiSections, {
    hero: {
      badge: tHero("badge"),
      titleLine1Accent: tHero("titleLine1Accent"),
      titleLine1Main: tHero("titleLine1Main"),
      titleLine2Main: tHero("titleLine2Main"),
      titleLine2Accent: tHero("titleLine2Accent"),
      description: tHero("description"),
      features: tHero.raw("features") as string[],
      residentialCta: tHero("residentialCta"),
      commercialCta: tHero("commercialCta"),
      mostRequested: tHero("mostRequested"),
      whatsapp: tHero("whatsapp"),
      visualAlt: tHero("visualAlt"),
      imageUrl: "/images/hero.png",
    },
    authorities: {
      badge: tTrusted("badge"),
      titlePrefix: tTrusted("titlePrefix"),
      titleAccent: tTrusted("titleAccent"),
      description: tTrusted("description"),
      viewLicense: tTrusted("viewLicense"),
      entities: tTrusted.raw("entities") as Record<
        string,
        { name: string; nameEn: string; description: string }
      >,
      config: trustedEntitiesConfig,
    },
    features: {
      badge: tAdvantages("badge"),
      titlePrefix: tAdvantages("titlePrefix"),
      titleAccent: tAdvantages("titleAccent"),
      titleSuffix: tAdvantages("titleSuffix"),
      description: tAdvantages("description"),
      items: tAdvantages.raw("items") as Record<string, AdvantageItemTranslations>,
      config: advantageItemsConfig,
    },
    pricing: {
      badge: tPricing("badge"),
      titlePrefix: tPricing("titlePrefix"),
      titleAccent: tPricing("titleAccent"),
      description: tPricing("description"),
      benefitsTitle: tPricing("benefitsTitle"),
      plans: tPricing.raw("plans") as Array<{
        id: string;
        icon: string;
        title: string;
        description: string;
        price: string;
        period: string;
        features: string[];
        cta: string;
      }>,
    },
    contact: {
      eyebrow: tSupport("eyebrow"),
      titleLine1: tSupport("titleLine1"),
      titleLine2: tSupport("titleLine2"),
      titleLine3: tSupport("titleLine3"),
      description: tSupport("description"),
      cta: tSupport("cta"),
      satisfaction: tSupport("satisfaction"),
      responseTime: tSupport("responseTime"),
      imageAlt: tSupport("imageAlt"),
      imageUrl: "/images/support-banner.png",
      whatsappHref: "https://wa.me/",
    },
    app: {
      eyebrow: tApp("eyebrow"),
      titleLine1: tApp("titleLine1"),
      titleLine2: tApp("titleLine2"),
      description: tApp("description"),
      imageAlt: tApp("imageAlt"),
      imageUrl: "/images/app-banner.png",
    },
  });

  return (
    <main>
      <HeroSection content={content.hero} />
      <TrustedEntitiesSection content={content.authorities} />
      <ServicesSection />
      <AdvantagesSection content={content.features} />
      <PricingSection content={content.pricing} />
      <SupportSection content={content.contact} />
      <AppSection content={content.app} />
      <FaqSectionBoundary />
    </main>
  );
}
