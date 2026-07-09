"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import type { ContractPaymentStatusData } from "@/features/create-contract/types/contract-payment";
import type { ContractPaymentStatusSource } from "@/features/create-contract/services/get-contract-payment-status";
import PaymentStatusContent from "@/features/payment/components/payment-status-content";

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
  source: ContractPaymentStatusSource;
  status: "success" | "error";
  labels: PaymentStatusVerifierLabels;
};

type VerificationState =
  | { state: "loading" }
  | {
      state: "resolved";
      variant: "success" | "error";
      message: string;
      statusData: ContractPaymentStatusData | null;
      confirmedSuccess: boolean;
    };

export default function PaymentStatusVerifier({
  contractUuid,
  source,
  status,
  labels,
}: PaymentStatusVerifierProps) {
  const [verification, setVerification] = useState<VerificationState>({
    state: "loading",
  });

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      setVerification({ state: "loading" });

      try {
        const response = await fetch(
          `/api/payment-status/${source}/${status}/${contractUuid}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const payload = (await response.json().catch(() => null)) as
          | {
              ok: boolean;
              error?: string;
              message?: string;
              confirmedSuccess?: boolean;
              data?: ContractPaymentStatusData;
            }
          | null;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !payload?.ok) {
          setVerification({
            state: "resolved",
            variant: "error",
            message: payload?.error || labels.failedMessage,
            statusData: payload?.data ?? null,
            confirmedSuccess: false,
          });
          return;
        }

        const confirmedSuccess = Boolean(payload.confirmedSuccess);

        setVerification({
          state: "resolved",
          variant: confirmedSuccess ? "success" : "error",
          message: confirmedSuccess ? labels.completedMessage : payload.message || labels.failedMessage,
          statusData: payload.data ?? null,
          confirmedSuccess,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setVerification({
          state: "resolved",
          variant: "error",
          message: labels.failedMessage,
          statusData: null,
          confirmedSuccess: false,
        });
      }
    }

    void verify();

    return () => {
      isMounted = false;
    };
  }, [contractUuid, labels.completedMessage, labels.failedMessage, source, status]);

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

  const isSuccess = verification.variant === "success";

  return (
    <PaymentStatusContent
      variant={verification.variant}
      backLabel={labels.backLabel}
      pageTitle={isSuccess ? labels.successPageTitle : labels.errorPageTitle}
      title={isSuccess ? labels.successTitle : labels.errorTitle}
      description={isSuccess ? labels.successDescription : labels.errorDescription}
      message={verification.message}
      contractNumberLabel={labels.contractNumberLabel}
      contractIdLabel={labels.contractIdLabel}
      contractNumber={contractUuid}
      backToRequestsLabel={labels.backToRequestsLabel}
      backToHomeLabel={labels.backToHomeLabel}
      retryPaymentLabel={labels.retryPaymentLabel}
      retryPaymentLoadingLabel={labels.retryPaymentLoadingLabel}
      retryPaymentErrorLabel={labels.retryPaymentErrorLabel}
      source={source}
      status={verification.statusData}
    />
  );
}
