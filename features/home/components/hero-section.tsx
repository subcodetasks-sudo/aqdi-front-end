import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

import HeroContent from "@/features/home/components/hero-content";
import HeroVisual from "@/features/home/components/hero-visual";
import HeroWhatsappButton from "@/features/home/components/hero-whatsapp-button";
import Navbar from "@/features/shared/components/navbar";
import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";
import {
  fadeInUp,
  motionTransition,
  motionViewport,
  staggerContainer,
  staggerImageItem,
  staggerItem,
} from "@/lib/motion-variants";

export default async function HeroSection() {
  const t = await getTranslations("hero");
  const features = t.raw("features") as string[];

  return (
    <section className="relative m-2 min-h-screen rounded-3xl bg-brand-background-green pb-2 lg:m-4 mt-0!  lg:rounded-[60px] 2xl:rounded-[80px] rounded-t-none! overflow-hidden">
      <div
        className="absolute inset-s-[-16%] top-1/2 flex -translate-y-1/2 -rotate-90 items-center gap-2 2xl:inset-s-[-7%] max-lg:hidden"
      >
        <MobileAppLable />
        <MobileAppBtns />
      </div>

      <div className="container pb-10 pt-2">
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
            className="w-full shrink-0 lg:w-[50%] 2xl:w-[60%]"
          >
            <HeroVisual alt={t("visualAlt")} />
          </div>
        </div>


          <HeroWhatsappButton label={t("whatsapp")} />
      </div>
    </section>
  );
}
