import { getTranslations } from "next-intl/server";

import HeroContent from "@/features/home/components/hero-content";
import HeroVisual from "@/features/home/components/hero-visual";
import HeroWhatsappButton from "@/features/home/components/hero-whatsapp-button";
import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";

export default async function HeroSection() {
  const t = await getTranslations("hero");
  const features = t.raw("features") as string[];

  return (
    <section className="relative min-h-screend rounded-3xl bg-brand-background-green pb-2   lg:rounded-[60px] 2xl:rounded-[80px] rounded-t-none! overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 lg:inset-s-[3%]  z-10 max-lg:hidden lg:scale-50 xl:scale-75 2xl:scale-100">
        <div className="flex size-0 items-center justify-center overflow-visible">
          <div className="flex w-max  -rotate-90 items-center gap-2 whitespace-nowrap">
            <MobileAppLable />
            <MobileAppBtns />
          </div>
        </div>
      </div>

      <div className="container pb-10 ">
        <div
          className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8"
        >
          <div className="min-w-0 flex-1">
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
          </div>

          <div
            className="w-full shrink-0 lg:w-[50%] max-lg:hidden "
          >
            <HeroVisual alt={t("visualAlt")} />
          </div>
        </div>


          <HeroWhatsappButton label={t("whatsapp")} />
      </div>
    </section>
  );
}
