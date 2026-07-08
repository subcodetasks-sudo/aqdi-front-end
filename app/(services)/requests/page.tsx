import { getTranslations } from "next-intl/server";

import RequestsPageContent from "@/features/requests/components/requests-page-content";
import { getContracts } from "@/features/requests/services/get-contracts";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";
import { mapContractToRequestCard } from "@/features/requests/utils/map-contract-to-request-card";

export default async function RequestsPage() {
  const t = await getTranslations("requests");

  const labels: RequestLabels = {
    backLabel: t("backLabel"),
    pageTitle: t("pageTitle"),
    emptyState: t("emptyState"),
    tabs: {
      residential: t("tabs.residential"),
      commercial: t("tabs.commercial"),
    },
    contractTypes: {
      housing: t("contractTypes.housing"),
      commercial: t("contractTypes.commercial"),
    },
    card: {
      requestDateLabel: t("card.requestDateLabel"),
      requestNumberLabel: t("card.requestNumberLabel"),
      inquiryDivider: t("card.inquiryDivider"),
      copyRequestNumber: t("card.copyRequestNumber"),
      paymentSuccessful: t("card.paymentSuccessful"),
      viewOrEdit: t("card.viewOrEdit"),
      editError: t("card.editError"),
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
  };

  let residentialItems: RequestCardData[] = [];
  let commercialItems: RequestCardData[] = [];

  try {
    const contracts = await getContracts();

    residentialItems = contracts
      .filter((contract) => contract.contract_type === "housing")
      .map((contract) => mapContractToRequestCard(contract, labels.contractTypes));

    commercialItems = contracts
      .filter((contract) => contract.contract_type === "commercial")
      .map((contract) => mapContractToRequestCard(contract, labels.contractTypes));
  } catch {
    residentialItems = [];
    commercialItems = [];
  }
  console.log(residentialItems);
  console.log(commercialItems);

  return (
    <RequestsPageContent
      labels={labels}
      residentialItems={residentialItems}
      commercialItems={commercialItems}
    />
  );
}
