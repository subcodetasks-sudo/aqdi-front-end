import { getTranslations } from "next-intl/server";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import MobileAppStoreButton from "@/features/shared/components/mobile-app-store-button";

export default async function MobileAppBtns() {
  const t = await getTranslations("hero");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <MobileAppStoreButton
        href="https://apps.apple.com"
        variant="apple"
        labelTop={t("downloadOnThe")}
        labelBottom={t("appStore")}
        icon={<FaApple className="size-6" aria-hidden="true" />}
      />
      <MobileAppStoreButton
        href="https://play.google.com/store"
        variant="google"
        labelTop={t("downloadOnThe")}
        labelBottom={t("googlePlay")}
        icon={<FaGooglePlay className="size-6" aria-hidden="true" />}
      />
    </div>
  );
}
