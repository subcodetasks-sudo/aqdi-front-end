import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { APP_SECTION_ID } from "@/features/shared/constants/app-section";
import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";

export default async function AppSection() {
  const t = await getTranslations("appSection");

  return (
    <section id={APP_SECTION_ID} className="scroll-mt-36 py-16 md:py-20">
      <div className="container space-y-10 md:space-y-12">
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold text-brand">{t("eyebrow")}</p>
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            <span className="text-foreground">{t("titleLine1")}</span>
            <br />
            <span className="text-brand">{t("titleLine2")}</span>
          </h2>
          <p className="max-w-lg text-sm leading-7 text-black md:text-base">
            {t("description")}
          </p>
        </header>

   
          <Image
            src="/images/app-banner.png"
            alt={t("imageAlt")}
            width={1628}
            height={782}
            className="h-auto w-full  object-cover"
          />

        <div className="flex flex-col items-center gap-5">
          <MobileAppLable />
          <MobileAppBtns />
        </div>
      </div>
    </section>
  );
}
