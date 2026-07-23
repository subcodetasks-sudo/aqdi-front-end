"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUncompletedContract } from "@/features/create-contract/services/get-uncompleted-contract";
import RequestEditContractButton from "@/features/requests/components/request-edit-contract-button";
import type { RequestCardData } from "@/features/requests/types/request";
import {
  getIncompletePathStepStatus,
  INCOMPLETE_PATH_STEP_KEYS,
  resolveIncompletePathCurrentStep,
  type IncompletePathStepStatus,
} from "@/features/requests/utils/resolve-incomplete-path-step";
import { cn } from "@/lib/utils";

export type RequestIncompleteProgressDialogLabels = {
  title: string;
  close: string;
  loading: string;
  requestNumberLabel: string;
  contractTypeLabel: string;
  financialFeeLabel: string;
  pathTitle: string;
  continueCta: string;
  currency: string;
  draftBadge: string;
  stepStatus: {
    completed: string;
    current: string;
    pending: string;
  };
  steps: Record<
    (typeof INCOMPLETE_PATH_STEP_KEYS)[number],
    string
  >;
};

type RequestIncompleteProgressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Pick<
    RequestCardData,
    "uuid" | "requestNumber" | "contractType" | "step"
  >;
  unitTypeLabel: string;
  contractTypeFullLabel: string;
  continueErrorLabel: string;
  labels: RequestIncompleteProgressDialogLabels;
};

function PathDot({ status }: { status: IncompletePathStepStatus }) {
  if (status === "completed") {
    return <span className="relative z-10 mt-0.5 size-3.5 shrink-0 rounded-full bg-brand" />;
  }

  if (status === "current") {
    return (
      <span className="relative z-10 mt-0.5 size-3.5 shrink-0 rounded-full border-2 border-[#f59e0b] bg-white" />
    );
  }

  return (
    <span className="relative z-10 mt-0.5 size-3.5 shrink-0 rounded-full border-2 border-[#d4d4d4] bg-white" />
  );
}

export default function RequestIncompleteProgressDialog({
  open,
  onOpenChange,
  card,
  unitTypeLabel,
  contractTypeFullLabel,
  continueErrorLabel,
  labels,
}: RequestIncompleteProgressDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [feeLabel, setFeeLabel] = useState<string | null>(null);
  const currentStep = resolveIncompletePathCurrentStep(card.step);
  const title = labels.title.replace("{number}", card.requestNumber);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadFee() {
      setIsLoading(true);
      setFeeLabel(null);

      const result = await getUncompletedContract(card.uuid);

      if (cancelled) {
        return;
      }

      if (!result.ok) {
        toast.error(result.error || continueErrorLabel);
        setIsLoading(false);
        return;
      }

      const fee = result.data.step6?.doc_fee;
      setFeeLabel(
        typeof fee === "number" && Number.isFinite(fee)
          ? `${fee.toLocaleString("en-US")} ${labels.currency}`
          : null,
      );
      setIsLoading(false);
    }

    void loadFee();

    return () => {
      cancelled = true;
    };
  }, [open, card.uuid, continueErrorLabel, labels.currency]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="scrollbar-hide max-h-[min(90vh,820px)] gap-0 overflow-y-auto rounded-[28px] border-0 p-5 sm:max-w-lg md:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-3 text-start">
            <DialogTitle className="text-lg font-extrabold text-[#222222] md:text-xl">
              {title}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
                  card.contractType === "commercial"
                    ? "bg-[#e8f1ff] text-[#3b82f6]"
                    : "bg-brand-background-green text-brand",
                )}
              >
                {unitTypeLabel}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold text-[#e67e22]">
                {labels.draftBadge}
              </span>
            </div>
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

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a8a8a]">{labels.requestNumberLabel}</span>
            <span className="text-sm font-bold text-[#222222]">
              #{card.requestNumber}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f0] pt-3">
            <span className="text-sm text-[#8a8a8a]">{labels.contractTypeLabel}</span>
            <span className="text-sm font-bold text-[#222222]">
              {contractTypeFullLabel}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f0] pt-3">
            <span className="text-sm text-[#8a8a8a]">
              {labels.financialFeeLabel}
            </span>
            <span className="text-sm font-bold text-[#222222]">
              {isLoading ? labels.loading : feeLabel || "—"}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-extrabold text-[#222222]">
            {labels.pathTitle}
          </h3>

          <ol className="relative space-y-0">
            {INCOMPLETE_PATH_STEP_KEYS.map((key, index) => {
              const stepIndex = index + 1;
              const status = getIncompletePathStepStatus(stepIndex, currentStep);
              const isLast = index === INCOMPLETE_PATH_STEP_KEYS.length - 1;
              const nextStatus = isLast
                ? null
                : getIncompletePathStepStatus(stepIndex + 1, currentStep);
              const lineClass =
                status === "completed"
                  ? nextStatus === "current"
                    ? "bg-[#f59e0b]"
                    : "bg-brand"
                  : "bg-[#e5e5e5]";

              return (
                <li key={key} className="relative flex gap-3 pb-4 last:pb-0">
                  {!isLast ? (
                    <span
                      className={cn(
                        "absolute inset-s-1.5 top-3.5 bottom-0 w-0.5",
                        lineClass,
                      )}
                      aria-hidden="true"
                    />
                  ) : null}

                  <PathDot status={status} />

                  <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          status === "completed" && "text-brand",
                          status === "current" && "text-[#f59e0b]",
                          status === "pending" && "text-[#b0b0b0]",
                        )}
                      >
                        {labels.steps[key]}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          status === "completed" && "text-brand",
                          status === "current" && "text-[#f59e0b]",
                          status === "pending" && "text-[#b0b0b0]",
                        )}
                      >
                        {status === "completed"
                          ? labels.stepStatus.completed
                          : status === "current"
                            ? labels.stepStatus.current
                            : labels.stepStatus.pending}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-5">
          <RequestEditContractButton
            uuid={card.uuid}
            contractType={card.contractType}
            label={labels.continueCta}
            errorLabel={continueErrorLabel}
            showIcon={false}
            className="h-12 w-full rounded-2xl bg-brand text-white hover:bg-brand/90 hover:text-white"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
