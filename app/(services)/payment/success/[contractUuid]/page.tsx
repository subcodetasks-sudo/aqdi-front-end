import { getTranslations } from "next-intl/server";

import PaymentStatusVerifier from "@/features/payment/components/payment-status-verifier";
import { getPaymentContent } from "@/features/payment/services/get-payment-content";

type PaymentSuccessPageProps = {
  params: Promise<{
    contractUuid: string;
  }>;
};

export default async function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const { contractUuid } = await params;
  const t = await getTranslations("paymentStatus");
  const paymentContent = await getPaymentContent("success");

  return (
    <PaymentStatusVerifier
      contractUuid={contractUuid}
      status="success"
      paymentContent={paymentContent}
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
