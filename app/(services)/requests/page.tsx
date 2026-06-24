import { getTranslations } from "next-intl/server";

import RequestsPageContent from "@/features/requests/components/requests-page-content";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";

export default async function RequestsPage() {
  const t = await getTranslations("requests");

  const labels: RequestLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    tabs: {
      residential: t("tabs.residential"),
      commercial: t("tabs.commercial"),
    },
    card: {
      requestDateLabel: t("card.requestDateLabel"),
      requestNumberLabel: t("card.requestNumberLabel"),
      inquiryDivider: t("card.inquiryDivider"),
      copyRequestNumber: t("card.copyRequestNumber"),
      paymentSuccessful: t("card.paymentSuccessful"),
      viewOrEdit: t("card.viewOrEdit"),
      completePaymentHint: t("card.completePaymentHint"),
      completePayment: t("card.completePayment"),
      helpCenter: t("card.helpCenter"),
      whenReceiveContract: t("card.whenReceiveContract"),
      status: {
        completed: t("card.status.completed"),
        incomplete: t("card.status.incomplete"),
        inProgress: t("card.status.inProgress"),
        returned: t("card.status.returned"),
      },
    },
    residentialItems: t.raw("residentialItems") as RequestCardData[],
    commercialItems: t.raw("commercialItems") as RequestCardData[],
  };

  return <RequestsPageContent labels={labels} />;
}
