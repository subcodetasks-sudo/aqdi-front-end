import Image from "next/image";
import { getTranslations } from "next-intl/server";

import type { HomeAppResolved } from "@/features/home/types/home-content";
import { APP_SECTION_ID } from "@/features/shared/constants/app-section";
import MobileAppBtns from "@/features/shared/components/mobile-app-btns";
import MobileAppLable from "@/features/shared/components/mobile-app-lable";

type AppSectionProps = {
  content?: HomeAppResolved;
};

export default async function AppSection({ content }: AppSectionProps) {
  const resolved =
    content ??
    (await (async () => {
      const t = await getTranslations("appSection");
      return {
        eyebrow: t("eyebrow"),
        titleLine1: t("titleLine1"),
        titleLine2: t("titleLine2"),
        description: t("description"),
        imageAlt: t("imageAlt"),
        imageUrl: "/images/app-banner.png",
      } satisfies HomeAppResolved;
    })());

  return (
    <section id={APP_SECTION_ID} className="scroll-mt-36 py-16 md:py-20">
      <div className="container space-y-10 md:space-y-12">
        <header className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold text-brand">{resolved.eyebrow}</p>
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
            <span className="text-foreground">{resolved.titleLine1}</span>
            {resolved.titleLine2 ? (
              <>
                <br />
                <span className="text-brand">{resolved.titleLine2}</span>
              </>
            ) : null}
          </h2>
          <p className="max-w-lg text-sm leading-7 text-black md:text-base">
            {resolved.description}
          </p>
        </header>

        <Image
          src={resolved.imageUrl}
          alt={resolved.imageAlt}
          width={1628}
          height={782}
          className="h-auto w-full  object-cover"
          unoptimized={
            resolved.imageUrl.startsWith("http://") ||
            resolved.imageUrl.startsWith("https://")
          }
        />

        <div className="flex flex-col items-center gap-5">
          <MobileAppLable />
          <MobileAppBtns />
        </div>
      </div>
    </section>
  );
}
