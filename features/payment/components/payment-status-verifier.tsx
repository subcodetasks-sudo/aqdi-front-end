"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PaymentStatusContent from "@/features/payment/components/payment-status-content";
import {
  resolvePaymentStatusUi,
  type PaymentStatusUiState,
} from "@/features/payment/utils/resolve-payment-status-ui";
import { BASE_URL } from "@/lib/api/constants";

type PaymentStatusVerifierLabels = {
  backLabel: string;
  successPageTitle: string;
  successTitle: string;
  successDescription: string;
  errorPageTitle: string;
  errorTitle: string;
  errorDescription: string;
  contractNumberLabel: string;
  contractIdLabel: string;
  backToRequestsLabel: string;
  backToHomeLabel: string;
  retryPaymentLabel: string;
  retryPaymentLoadingLabel: string;
  retryPaymentErrorLabel: string;
  checkingTitle: string;
  checkingDescription: string;
  completedMessage: string;
  failedMessage: string;
};

type PaymentStatusVerifierProps = {
  contractUuid: string;
  status: "success" | "error";
  labels: PaymentStatusVerifierLabels;
};

type VerificationState =
  | { state: "loading" }
  | ({ state: "resolved" } & PaymentStatusUiState);

export default function PaymentStatusVerifier({
  contractUuid,
  status,
  labels,
}: PaymentStatusVerifierProps) {
  const router = useRouter();
  const [verification, setVerification] = useState<VerificationState>({
    state: "loading",
  });

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      setVerification({ state: "loading" });

      try {
        const search = window.location.search;
        const endpoint = `${BASE_URL}/status/${status}/${contractUuid}${search}`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as Parameters<
          typeof resolvePaymentStatusUi
        >[0];

        if (!isMounted) {
          return;
        }

        const outcome = resolvePaymentStatusUi(payload, {
          completedMessage: labels.completedMessage,
          failedMessage: labels.failedMessage,
        });

        setVerification({
          state: "resolved",
          ...outcome,
        });

        if (outcome.isPaid) {
          router.refresh();
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setVerification({
          state: "resolved",
          variant: "error",
          message: labels.failedMessage,
          statusData: null,
          isPaid: false,
        });
      }
    }

    void verify();

    return () => {
      isMounted = false;
    };
  }, [
    contractUuid,
    labels.completedMessage,
    labels.failedMessage,
    router,
    status,
  ]);

  if (verification.state === "loading") {
    return (
      <section className="container py-8 lg:py-10">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-background text-brand">
            <LoaderCircle className="size-9 animate-spin" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-brand md:text-3xl">
            {labels.checkingTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#7f7f7f]">
            {labels.checkingDescription}
          </p>
        </div>
      </section>
    );
  }

  const isPaid = verification.isPaid;

  return (
    <PaymentStatusContent
      variant={verification.variant}
      backLabel={labels.backLabel}
      pageTitle={isPaid ? labels.successPageTitle : labels.errorPageTitle}
      title={isPaid ? labels.successTitle : labels.errorTitle}
      description={
        isPaid ? labels.successDescription : labels.errorDescription
      }
      message={verification.message}
      contractNumberLabel={labels.contractNumberLabel}
      contractIdLabel={labels.contractIdLabel}
      contractNumber={contractUuid}
      backToRequestsLabel={labels.backToRequestsLabel}
      backToHomeLabel={labels.backToHomeLabel}
      retryPaymentLabel={labels.retryPaymentLabel}
      retryPaymentLoadingLabel={labels.retryPaymentLoadingLabel}
      retryPaymentErrorLabel={labels.retryPaymentErrorLabel}
      status={verification.statusData}
    />
  );
}
