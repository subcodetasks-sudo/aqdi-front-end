import { AlertCircle, CircleCheck, FileText, Hash, Home, ListOrdered } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ContractPaymentStatusSource } from "@/features/create-contract/services/get-contract-payment-status";
import type { ContractPaymentStatusData } from "@/features/create-contract/types/contract-payment";
import PaymentContentActionButton from "@/features/payment/components/payment-content-button";
import PaymentRetryButton from "@/features/payment/components/payment-retry-button";
import ServicesPageBackConfig from "@/features/services/components/services-page-back-config";
import CustomIcon from "@/features/shared/components/custom-icon";
import {
  parsePaymentContentButtons,
  type PaymentContentItem,
} from "@/features/payment/types/payment-content";

type PaymentStatusContentProps = {
  variant: "success" | "error";
  backLabel: string;
  pageTitle: string;
  title: string;
  description: string;
  message: string;
  contractNumberLabel: string;
  contractIdLabel: string;
  contractNumber: string;
  backToRequestsLabel: string;
  backToHomeLabel: string;
  retryPaymentLabel: string;
  retryPaymentLoadingLabel: string;
  retryPaymentErrorLabel: string;
  paymentContent?: PaymentContentItem | null;
  source?: ContractPaymentStatusSource;
  status?: ContractPaymentStatusData | null;
};

export default function PaymentStatusContent({
  variant,
  backLabel,
  pageTitle,
  title,
  description,
  message,
  contractNumberLabel,
  contractIdLabel,
  contractNumber,
  backToRequestsLabel,
  backToHomeLabel,
  retryPaymentLabel,
  retryPaymentLoadingLabel,
  retryPaymentErrorLabel,
  paymentContent = null,
  source = "contract",
  status,
}: PaymentStatusContentProps) {
  const isSuccess = variant === "success";
  const formattedContractNumber = contractNumber.startsWith("#")
    ? contractNumber
    : `#${contractNumber}`;
  const apiButtons = parsePaymentContentButtons(paymentContent);
  const mainText = paymentContent?.message?.trim() || description;
  const subText = paymentContent?.message?.trim() ? message : "";

  return (
    <>
      <ServicesPageBackConfig
        backLabel={backLabel}
        backHref="/requests"
        pageTitle={pageTitle}
      />

      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div
            className={`px-6 py-8 text-center md:px-10 md:py-10 ${
              isSuccess
                ? "bg-linear-to-b from-[#f3fbf8] to-white"
                : "bg-linear-to-b from-[#fff5f5] to-white"
            }`}
          >
            <div className="relative mx-auto flex w-fit items-center justify-center pb-2">
              <span
                className={`absolute top-8 size-20 rounded-full blur-2xl ${
                  isSuccess ? "bg-brand-secondary/40" : "bg-red-300/50"
                }`}
                aria-hidden="true"
              />
              <div
                className={`relative flex size-20 items-center justify-center rounded-full shadow-lg ${
                  isSuccess
                    ? "bg-linear-to-bl from-brand-secondary via-brand to-brand shadow-[0_10px_28px_rgba(13,179,139,0.28)]"
                    : "bg-linear-to-bl from-red-500 via-red-600 to-red-700 shadow-[0_10px_28px_rgba(239,68,68,0.25)]"
                }`}
              >
                {isSuccess ? (
                  <CustomIcon
                    src="/icons/shiled-check.svg"
                    size={32}
                    className="text-white"
                  />
                ) : (
                  <AlertCircle className="size-9 text-white" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isSuccess
                    ? "bg-brand-secondary/10 text-brand-secondary"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {isSuccess ? (
                  <CircleCheck className="size-3.5" aria-hidden="true" />
                ) : (
                  <AlertCircle className="size-3.5" aria-hidden="true" />
                )}
                {title}
              </div>

              <h1 className="text-2xl font-extrabold leading-relaxed text-brand md:text-3xl">
                {mainText}
              </h1>
              {subText ? (
                <p className="mx-auto max-w-md text-sm leading-relaxed text-[#7f7f7f]">
                  {subText}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 px-6 pb-6 pt-2 md:px-10 md:pb-8">
            <div className="rounded-2xl border border-[#ececec] bg-brand-background p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                  <Hash className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 text-start">
                  <p className="text-xs text-muted-foreground">{contractNumberLabel}</p>
                  <p className="mt-1 truncate text-lg font-extrabold text-foreground">
                    {formattedContractNumber}
                  </p>
                </div>
              </div>
            </div>

            {status?.contractId ? (
              <div className="rounded-2xl border border-[#ececec] bg-brand-background p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 text-start">
                    <p className="text-xs text-muted-foreground">{contractIdLabel}</p>
                    <p className="mt-1 text-lg font-extrabold text-foreground">
                      {status.contractId}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-3 pt-2">
              {isSuccess ? (
                <Button
                  asChild
                  className="h-12 w-full rounded-xl bg-linear-to-br from-brand-secondary via-brand to-brand text-sm font-bold text-white hover:opacity-90"
                >
                  <Link href="/requests">
                    <ListOrdered className="size-4" aria-hidden="true" />
                    {backToRequestsLabel}
                  </Link>
                </Button>
              ) : (
                <PaymentRetryButton
                  contractUuid={contractNumber.replace(/^#/, "")}
                  source={source}
                  label={retryPaymentLabel}
                  payingLabel={retryPaymentLoadingLabel}
                  errorLabel={retryPaymentErrorLabel}
                />
              )}

              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-xl border-[#e8e8e8] bg-white text-sm font-bold text-brand hover:bg-brand-background"
              >
                <Link href={isSuccess ? "/" : "/requests"}>
                  {isSuccess ? (
                    <Home className="size-4" aria-hidden="true" />
                  ) : (
                    <ListOrdered className="size-4" aria-hidden="true" />
                  )}
                  {isSuccess ? backToHomeLabel : backToRequestsLabel}
                </Link>
              </Button>

              {!isSuccess ? (
                <Button
                  asChild
                  variant="ghost"
                  className="h-11 w-full rounded-xl text-sm font-semibold text-muted-foreground hover:bg-brand-background hover:text-brand"
                >
                  <Link href="/">
                    <Home className="size-4" aria-hidden="true" />
                    {backToHomeLabel}
                  </Link>
                </Button>
              ) : null}

              {apiButtons.map((button, index) => (
                <PaymentContentActionButton
                  key={`${button.href}-${button.text}`}
                  button={button}
                  variant={index === 0 ? "primary" : "secondary"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
