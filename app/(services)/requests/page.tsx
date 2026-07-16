import { getTranslations } from "next-intl/server";

import RequestsPageContent from "@/features/requests/components/requests-page-content";
import { getContracts } from "@/features/requests/services/get-contracts";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestLabels } from "@/features/requests/types/request-labels";
import { mapContractToRequestCard } from "@/features/requests/utils/map-contract-to-request-card";

export default async function RequestsPage() {
  const t = await getTranslations("requests");
  const tPayment = await getTranslations("createContract.payment");

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
      completePaymentLoading: t("card.completePaymentLoading"),
      paymentFlow: {
        methodDialog: {
          title: tPayment("methodDialog.title"),
          question: tPayment("methodDialog.question"),
          submitting: tPayment("methodDialog.submitting"),
          draft: {
            title: tPayment("methodDialog.draft.title"),
            description: tPayment("methodDialog.draft.description"),
          },
          payNow: {
            title: tPayment("methodDialog.payNow.title"),
            description: tPayment("methodDialog.payNow.description"),
          },
          missingContractSession: tPayment("methodDialog.missingContractSession"),
          draftError: tPayment("methodDialog.draftError"),
        },
        draftSuccessDialog: {
          title: tPayment("draftSuccessDialog.title"),
          paymentStatusLabel: tPayment("draftSuccessDialog.paymentStatusLabel"),
          paymentStatusDescription: tPayment(
            "draftSuccessDialog.paymentStatusDescription",
          ),
          orderNumberLabel: tPayment("draftSuccessDialog.orderNumberLabel"),
          copy: tPayment("draftSuccessDialog.copy"),
          copySuccess: tPayment("draftSuccessDialog.copySuccess"),
          copyError: tPayment("draftSuccessDialog.copyError"),
          preparationDescription: tPayment(
            "draftSuccessDialog.preparationDescription",
          ),
          whatsappCta: tPayment("draftSuccessDialog.whatsappCta"),
          whatsappHref: tPayment("draftSuccessDialog.whatsappHref"),
        },
        payError: tPayment("navigation.payError"),
      },
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

  return (
    <RequestsPageContent
      labels={labels}
      residentialItems={residentialItems}
      commercialItems={commercialItems}
    />
  );
}
