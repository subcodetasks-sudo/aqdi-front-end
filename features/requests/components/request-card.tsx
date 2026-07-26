"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, Home, Info } from "lucide-react";

import { contractFinanceSummaryKeys } from "@/features/create-contract/query-keys";
import { getContractFinanceSummary } from "@/features/create-contract/services/get-contract-finance-summary";
import { formatPaymentAmount } from "@/features/create-contract/types/payment-step";
import RequestCardActions from "@/features/requests/components/request-card-actions";
import RequestCopyIdButton from "@/features/requests/components/request-copy-id-button";
import RequestIncompleteActions from "@/features/requests/components/request-incomplete-actions";
import { useContractsLiveStore } from "@/features/requests/stores/use-contracts-live-store";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestCardLabels } from "@/features/requests/types/request-labels";
import { cn } from "@/lib/utils";

type RequestCardProps = {
  card: RequestCardData;
  labels: RequestCardLabels;
};

function resolveCompletedLabel(
  amount: number | null,
  labels: RequestCardLabels,
) {
  if (amount == null) {
    return labels.status.completed;
  }

  return labels.status.completedWithAmount.replaceAll(
    "{amount}",
    formatPaymentAmount(amount),
  );
}

/** Completion badge is driven by payment (`is_completed`), not employee status. */
function PaymentCompletionBadge({
  card,
  labels,
}: {
  card: RequestCardData;
  labels: RequestCardLabels;
}) {
  const financeQuery = useQuery({
    queryKey: contractFinanceSummaryKeys.detail(card.uuid),
    queryFn: () => getContractFinanceSummary(card.uuid),
    enabled: card.paymentSuccessful && card.payableAmount == null,
  });

  const amount =
    card.payableAmount ??
    (typeof financeQuery.data?.total_price === "number" &&
    Number.isFinite(financeQuery.data.total_price)
      ? financeQuery.data.total_price
      : null);

  const label = card.paymentSuccessful
    ? resolveCompletedLabel(amount, labels)
    : labels.draftIncompleteBadge;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        card.paymentSuccessful
          ? "bg-brand-background-green text-brand"
          : "bg-[#fff1e6] text-[#e67e22]",
      )}
    >
      {label}
    </span>
  );
}

export default function RequestCard({ card, labels }: RequestCardProps) {
  const livePatch = useContractsLiveStore((state) => state.byId[card.contractId]);
  const isCommercial = card.contractType === "commercial";
  const unitLabel = isCommercial
    ? labels.unitType.commercial
    : labels.unitType.residential;

  const statusColor = livePatch?.status_color || card.statusColor;
  const statusType = livePatch?.status_type || card.statusType;
  const journeyLabel =
    livePatch?.journey_status_label ||
    livePatch?.status_label ||
    card.journeyStatusLabel ||
    card.paymentStatusLabel ||
    (card.paymentSuccessful
      ? labels.status.completed
      : labels.draftIncompleteBadge);

  const contractTypeFullLabel = isCommercial
    ? labels.contractTypes.commercial
    : labels.contractTypes.housing;

  return (
    <article className="rounded-[28px] bg-white p-5 shadow-[0_2px_24px_rgba(0,0,0,0.04)] md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className={cn(
              "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl",
              isCommercial
                ? "bg-[#e8f1ff] text-[#3b82f6]"
                : "bg-brand-background-green text-brand",
            )}
          >
            {isCommercial ? (
              <Building2 className="size-6" aria-hidden="true" />
            ) : (
              <Home className="size-6" aria-hidden="true" />
            )}
          </span>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm font-extrabold text-[#222222] md:text-base">
                {labels.requestNumberLabel} {card.requestNumber}
              </p>
              <RequestCopyIdButton
                requestNumber={card.requestNumber}
                copyLabel={labels.copyRequestNumber}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
                  isCommercial
                    ? "bg-[#e8f1ff] text-[#3b82f6]"
                    : "bg-brand-background-green text-brand",
                )}
              >
                {unitLabel}
              </span>

              <PaymentCompletionBadge card={card} labels={labels} />

              {!card.isIncompleteDraft && statusType === "draft" ? (
                <span className="inline-flex items-center rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold text-[#e67e22]">
                  {labels.receiveContractDialog.draftBadge}
                </span>
              ) : null}
            </div>

            <p className="text-xs text-[#9a9a9a]">
              {labels.lastUpdatedLabel} {card.lastUpdated}
            </p>
          </div>
        </div>

        {!card.isIncompleteDraft ? (
          <div className="shrink-0 space-y-2 text-start lg:text-end">
            <p className="text-xs font-semibold text-[#9a9a9a]">
              {labels.requestStatusLabel}
            </p>
            <span
              className="inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: statusColor || "#3b82f6" }}
            >
              {journeyLabel}
            </span>
          </div>
        ) : null}
      </div>

      {card.isIncompleteDraft ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#f7f7f7] px-4 py-3">
          <Info
            className="mt-0.5 size-4 shrink-0 text-[#8a8a8a]"
            aria-hidden="true"
          />
          <p className="text-xs leading-6 text-[#6f6f6f]">
            {labels.incompleteValidityNotice}
          </p>
        </div>
      ) : null}

      <div className="mt-5">
        {card.isIncompleteDraft ? (
          <RequestIncompleteActions
            card={card}
            completeLabel={labels.completeRequest}
            viewLabel={labels.viewShort}
            editErrorLabel={labels.editError}
            unitTypeLabel={unitLabel}
            contractTypeFullLabel={contractTypeFullLabel}
            progressLabels={labels.incompleteProgressDialog}
          />
        ) : (
          <RequestCardActions card={card} labels={labels} />
        )}
      </div>
    </article>
  );
}
