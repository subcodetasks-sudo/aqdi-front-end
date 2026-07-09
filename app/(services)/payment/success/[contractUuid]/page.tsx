import { getTranslations } from "next-intl/server";

import type { ContractPaymentStatusSource } from "@/features/create-contract/services/get-contract-payment-status";
import PaymentStatusVerifier from "@/features/payment/components/payment-status-verifier";

type PaymentSuccessPageProps = {
  params: Promise<{
    contractUuid: string;
  }>;
  searchParams: Promise<{
    source?: string;
  }>;
};

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: PaymentSuccessPageProps) {
  const { contractUuid } = await params;
  const { source } = await searchParams;
  const t = await getTranslations("paymentStatus");
  const paymentSource: ContractPaymentStatusSource =
    source === "admin" ? "admin" : "contract";

  return (
    <PaymentStatusVerifier
      contractUuid={contractUuid}
      source={paymentSource}
      status="success"
      labels={{
        backLabel: t("backLabel"),
        successPageTitle: t("success.pageTitle"),
        successTitle: t("success.title"),
        successDescription: t("success.description"),
        errorPageTitle: t("error.pageTitle"),
        errorTitle: t("error.title"),
        errorDescription: t("error.description"),
        contractNumberLabel: t("contractNumberLabel"),
        contractIdLabel: t("contractIdLabel"),
        backToRequestsLabel: t("backToRequests"),
        backToHomeLabel: t("backToHome"),
        retryPaymentLabel: t("retryPayment"),
        retryPaymentLoadingLabel: t("retryPaymentLoading"),
        retryPaymentErrorLabel: t("retryPaymentError"),
        checkingTitle: t("checkingTitle"),
        checkingDescription: t("checkingDescription"),
        completedMessage: t("completedMessage"),
        failedMessage: t("failedMessage"),
      }}
    />
  );
}
