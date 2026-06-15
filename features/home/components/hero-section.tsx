import { getTranslations } from "next-intl/server";

import Navbar from "@/features/shared/components/navbar";
import HeroAppSidebar from "@/features/home/components/hero-app-sidebar";
import HeroContent from "@/features/home/components/hero-content";
import HeroVisual from "@/features/home/components/hero-visual";
import HeroWhatsappButton from "@/features/home/components/hero-whatsapp-button";

export default async function HeroSection() {
  const t = await getTranslations("hero");
  const features = t.raw("features") as string[];

  return (
    <section className="relative m-2 min-h-screen rounded-3xl bg-brand-background-green py-2 lg:m-4 lg:rounded-[60px] 2xl:rounded-[80px]">
      <Navbar />

          {/* <HeroAppSidebar
            downloadApp={t("downloadApp")}
            googlePlay={t("googlePlay")}
            appStore={t("appStore")}
          /> */}
      <div className="container  pb-10 pt-2">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          <HeroContent
            badge={t("badge")}
            titleLine1Accent={t("titleLine1Accent")}
            titleLine1Main={t("titleLine1Main")}
            titleLine2Main={t("titleLine2Main")}
            titleLine2Accent={t("titleLine2Accent")}
            description={t("description")}
            features={features}
            residentialCta={t("residentialCta")}
            commercialCta={t("commercialCta")}
            mostRequested={t("mostRequested")}
          />
          <HeroVisual alt={t("visualAlt")} />
        </div>

        <HeroWhatsappButton label={t("whatsapp")} />
      </div>
    </section>
  );
}
