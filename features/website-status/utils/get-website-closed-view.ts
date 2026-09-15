import { getTranslations } from "next-intl/server";

import type { WebsiteStatus } from "@/features/website-status/types/website-status";
import { resolveWebsiteClosedMessage } from "@/features/website-status/utils/resolve-website-closed-message";

export type WebsiteClosedView = {
  /** Prominent line — the backend message when set, otherwise the fallback. */
  headline: string;
  labels: {
    kicker: string;
    body: string;
    autoNote: string;
    logoAlt: string;
    brandName: string;
    tagline: string;
  };
};

/**
 * Assembles everything the maintenance notice renders, so the root layout and
 * the `/maintenance` route stay in sync.
 */
export async function getWebsiteClosedView(
  status: Pick<WebsiteStatus, "messageAr" | "messageEn">,
  locale: string,
): Promise<WebsiteClosedView> {
  const [t, tBrand] = await Promise.all([
    getTranslations("websiteClosed"),
    getTranslations("navbar.brand"),
  ]);

  return {
    headline: resolveWebsiteClosedMessage(status, locale, {
      ar: t("headline"),
      en: t("headline"),
    }),
    labels: {
      kicker: t("kicker"),
      body: t("body"),
      autoNote: t("autoNote"),
      logoAlt: tBrand("name"),
      brandName: tBrand("name"),
      tagline: tBrand("tagline"),
    },
  };
}
