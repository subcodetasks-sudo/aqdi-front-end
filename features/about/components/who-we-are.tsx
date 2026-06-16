import { getTranslations } from "next-intl/server";

import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";

export default async function WhoWeAre() {
  const t = await getTranslations("about.whoWeAre");

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center md:gap-8">
          <p className="text-sm text-gray-400 font-semibold">{t("eyebrow")}</p>

          <h1 className="text-4xl font-extrabold leading-relaxed text-brand md:text-5xl 2xl:text-6xl">
            <span className="block">{t("titleLine1")}</span>
            <span className="block">{t("titleLine2")}</span>
          </h1>

          <p className="max-w-xl text-sm leading-8 text-gray-400 font-semibold md:text-base">
            {t("description")}
          </p>

          <div className="flex flex-col items-center gap-5 pt-2">
            <MobileAppLable />
            <MobileAppBtns />
          </div>
        </div>
      </div>
    </section>
  );
}
