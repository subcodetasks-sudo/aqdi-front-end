import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import NotificationsPageContent from "@/features/notifications/components/notifications-page-content";
import type { NotificationsPageLabels } from "@/features/notifications/types/notifications-page-labels";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notificationsPage");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function NotificationsPage() {
  const t = await getTranslations("notificationsPage");

  const labels: NotificationsPageLabels = {
    title: t("title"),
    subtitle: t("subtitle"),
    emptyTitle: t("emptyTitle"),
    emptyDescription: t("emptyDescription"),
    loadError: t("loadError"),
    markAllRead: t("markAllRead"),
    markingAllRead: t("markingAllRead"),
    enableTitle: t("enableTitle"),
    enableDescription: t("enableDescription"),
    enableDenied: t("enableDenied"),
    enableUnsupported: t("enableUnsupported"),
    enableAction: t("enableAction"),
    enableLoading: t("enableLoading"),
    tabs: {
      all: t("tabs.all"),
      payment: t("tabs.payment"),
      general: t("tabs.general"),
    },
    pagination: {
      previous: t("pagination.previous"),
      next: t("pagination.next"),
    },
  };

  return <NotificationsPageContent labels={labels} />;
}
