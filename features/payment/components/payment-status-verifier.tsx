"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import type { ContractPaymentStatusData } from "@/features/create-contract/types/contract-payment";
import PaymentStatusContent from "@/features/payment/components/payment-status-content";
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

type RawPaymentStatusResponse = {
  message?: string;
  success?: boolean;
  data?: {
    result: "success" | "error";
    contract_uuid: string;
    contract_id: number;
    is_completed: boolean;
    employee_paid_record: ContractPaymentStatusData["employeePaidRecord"];
    payment: ContractPaymentStatusData["payment"];
  };
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

function normalizeStatusData(
  data: NonNullable<RawPaymentStatusResponse["data"]>,
): ContractPaymentStatusData {
  return {
    result: data.result,
    contractUuid: data.contract_uuid,
    contractId: data.contract_id,
    isCompleted: data.is_completed,
    employeePaidRecord: data.employee_paid_record,
    payment: data.payment,
  };
}

export default function PaymentStatusVerifier({
  contractUuid,
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
        const search = window.location.search;
        const endpoint = `${BASE_URL}/status/${status}/${contractUuid}${search}`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as
          | RawPaymentStatusResponse
          | null;

        if (!isMounted) {
          return;
        }

        if (!response.ok || payload?.success === false) {
          setVerification({
            state: "resolved",
            variant: "error",
            message: payload?.message || labels.failedMessage,
            statusData: payload?.data ? normalizeStatusData(payload.data) : null,
            confirmedSuccess: false,
          });
          return;
        }

        const normalizedStatus = payload?.data ? normalizeStatusData(payload.data) : null;
        const confirmedSuccess =
          normalizedStatus?.payment?.status === "success" ||
          normalizedStatus?.isCompleted === true;

        setVerification({
          state: "resolved",
          variant: confirmedSuccess ? "success" : "error",
          message: confirmedSuccess
            ? labels.completedMessage
            : payload?.message || labels.failedMessage,
          statusData: normalizedStatus,
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
  }, [contractUuid, labels.completedMessage, labels.failedMessage, status]);

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
      status={verification.statusData}
    />
  );
}
