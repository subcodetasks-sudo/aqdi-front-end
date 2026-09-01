import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import WebsiteClosedScreen from "@/features/website-status/components/website-closed-screen";
import { getWebsiteStatus } from "@/features/website-status/services/get-website-status";
import { getWebsiteClosedView } from "@/features/website-status/utils/get-website-closed-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("websiteClosed");

  return {
    title: t("headline"),
    robots: { index: false, follow: false },
  };
}

export default async function MaintenancePage() {
  const status = await getWebsiteStatus();

  if (status.isOpen) {
    redirect("/");
  }

  const locale = await getLocale();
  const view = await getWebsiteClosedView(status, locale);

  return <WebsiteClosedScreen view={view} />;
}
