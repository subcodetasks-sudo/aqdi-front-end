"use client";

import { Clock3, X } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import RequestCompletePaymentButton from "@/features/requests/components/request-complete-payment-button";
import type { ContractPaymentMethodLabels } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import { useContractJourney } from "@/features/requests/hooks/use-contract-journey";
import type { ContractJourneyStepState } from "@/features/requests/types/contract-journey";
import type { RequestActionType } from "@/features/requests/types/request";
import { cn } from "@/lib/utils";

export type RequestReceiveContractDialogLabels = {
  title: string;
  subtitle: string;
  close: string;
  loading: string;
  retry: string;
  draftBadge: string;
  statusUpdatedToast: string;
  expectedDurationTitle: string;
  expectedDurationBody: string;
  contactPrompt: string;
  whatsappCta: string;
  whatsappHref: string;
};

type RequestReceiveContractDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number;
  contractUuid: string;
  actionType: RequestActionType;
  completePaymentLabel: string;
  completePaymentLoadingLabel: string;
  paymentFlowLabels: ContractPaymentMethodLabels;
  labels: RequestReceiveContractDialogLabels;
};

function JourneyDot({ status }: { status: ContractJourneyStepState }) {
  if (status === "completed") {
    return (
      <span className="relative z-10 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand">
        <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />
      </span>
    );
  }

  if (status === "current") {
    return (
      <span className="relative z-10 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-[#f59e0b] bg-white">
        <span className="size-1.5 rounded-full bg-[#f59e0b]" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="relative z-10 mt-0.5 size-4 shrink-0 rounded-full border-2 border-[#d9d9d9] bg-white" />
  );
}

export default function RequestReceiveContractDialog({
  open,
  onOpenChange,
  contractId,
  contractUuid,
  actionType,
  completePaymentLabel,
  completePaymentLoadingLabel,
  paymentFlowLabels,
  labels,
}: RequestReceiveContractDialogProps) {
  const { detail, loading, error, reload } = useContractJourney({
    contractId,
    enabled: open,
  });

  const showPayButton = actionType === "complete-payment";
  const requestId = detail?.contractId ?? contractId;
  const subtitle = labels.subtitle.replace("{number}", String(requestId));
  const badgeLabel =
    detail?.journey_status_label || detail?.status_label || null;
  const journey = detail?.journey ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="scrollbar-hide max-h-[min(90vh,760px)] gap-0 overflow-y-auto rounded-[28px] border-0 p-5 sm:max-w-lg md:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2 text-start">
            <DialogTitle className="text-lg font-extrabold text-[#222222] md:text-xl">
              {labels.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-[#8a8a8a]">
              {subtitle}
            </DialogDescription>

            {badgeLabel ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{
                    backgroundColor: detail?.status_color || "#3b82f6",
                  }}
                >
                  {badgeLabel}
                </span>
                {detail?.status_type === "draft" ? (
                  <span className="inline-flex items-center rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold text-[#e67e22]">
                    {labels.draftBadge}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={labels.close}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#666666] transition-colors hover:bg-[#ebebeb]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {loading && !detail ? (
          <p className="py-10 text-center text-sm text-[#8a8a8a]">
            {labels.loading}
          </p>
        ) : null}

        {error && !detail ? (
          <div className="space-y-3 rounded-2xl bg-[#fff5f5] px-4 py-5 text-center">
            <p className="text-sm text-[#c0392b]">{error}</p>
            <button
              type="button"
              onClick={reload}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-bold text-white"
            >
              {labels.retry}
            </button>
          </div>
        ) : null}

        {journey.length > 0 ? (
          <ol className="relative space-y-0">
            {journey.map((step, index) => {
              const isLast = index === journey.length - 1;
              const nextState = isLast ? null : journey[index + 1]?.state;
              const lineClass =
                step.state === "completed" &&
                (nextState === "completed" || nextState === "current")
                  ? nextState === "current"
                    ? "bg-[#f59e0b]"
                    : "bg-brand"
                  : step.state === "current"
                    ? "bg-[#f59e0b]/40"
                    : "bg-[#e8e8e8]";

              return (
                <li key={`${step.key}-${index}`} className="relative flex gap-3 pb-5 last:pb-0">
                  {!isLast ? (
                    <span
                      className={cn(
                        "absolute inset-s-1.5 top-4 bottom-0 w-0.5",
                        lineClass,
                      )}
                      aria-hidden="true"
                    />
                  ) : null}

                  <JourneyDot status={step.state} />

                  <div className="min-w-0 space-y-1 pt-0.5">
                    <p
                      className={cn(
                        "text-sm font-extrabold leading-snug",
                        step.state === "completed" && "text-brand",
                        step.state === "current" && "text-[#f59e0b]",
                        step.state === "pending" && "text-[#b0b0b0]",
                      )}
                    >
                      {step.status_label}
                    </p>
                    {step.description ? (
                      <p
                        className={cn(
                          "text-xs leading-5",
                          step.state === "current"
                            ? "font-semibold text-[#f59e0b]"
                            : "text-[#9a9a9a]",
                        )}
                      >
                        {step.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}

        {!loading && detail && journey.length === 0 && !error ? (
          <p className="py-6 text-center text-sm text-[#8a8a8a]">
            {detail.status_label}
          </p>
        ) : null}

        <div className="mt-5 rounded-2xl bg-[#f7f7f7] px-4 py-3.5">
          <div className="mb-1.5 flex items-center gap-2">
            <Clock3 className="size-4 text-brand" aria-hidden="true" />
            <p className="text-sm font-extrabold text-brand">
              {labels.expectedDurationTitle}
            </p>
          </div>
          <p className="text-xs leading-6 text-[#6f6f6f]">
            {labels.expectedDurationBody}
          </p>
        </div>

        <p className="mt-5 text-center text-sm font-semibold text-[#555555]">
          {labels.contactPrompt}
        </p>

        <div className="mt-3 space-y-2.5">
          {showPayButton ? (
            <RequestCompletePaymentButton
              contractId={contractId}
              contractUuid={contractUuid}
              label={completePaymentLabel}
              payingLabel={completePaymentLoadingLabel}
              paymentFlowLabels={paymentFlowLabels}
              className="h-12 w-full rounded-2xl"
            />
          ) : null}

          <Link
            href={labels.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <FaWhatsapp className="size-5 shrink-0" aria-hidden="true" />
            {labels.whatsappCta}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
