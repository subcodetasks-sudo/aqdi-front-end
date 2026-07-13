import { CircleHelp, Headphones } from "lucide-react";

import RequestCompletePaymentButton from "@/features/requests/components/request-complete-payment-button";
import RequestEditContractButton from "@/features/requests/components/request-edit-contract-button";
import type { ContractPaymentMethodLabels } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestCardLabels } from "@/features/requests/types/request-labels";

type RequestCardActionsProps = {
  card: Pick<
    RequestCardData,
    "actionType" | "uuid" | "contractId" | "contractType" | "showViewEdit"
  >;
  labels: RequestCardLabels;
};

export default function RequestCardActions({
  card,
  labels,
}: RequestCardActionsProps) {
  const editButton = card.showViewEdit ? (
    <RequestEditContractButton
      uuid={card.uuid}
      contractType={card.contractType}
      label={labels.viewOrEdit}
      errorLabel={labels.editError}
    />
  ) : null;

  if (card.actionType === "none") {
    return editButton;
  }

  if (card.actionType === "complete-payment") {
    return (
      <div className="space-y-3">
        {editButton}
        <p className="text-center text-xs font-medium text-muted-foreground">
          {labels.completePaymentHint}
        </p>
        <RequestCompletePaymentButton
          contractId={card.contractId}
          contractUuid={card.uuid}
          label={labels.completePayment}
          payingLabel={labels.completePaymentLoading}
          paymentFlowLabels={labels.paymentFlow}
        />
      </div>
    );
  }

  if (card.actionType === "dual-actions") {
    return (
      <div className="space-y-3">
        {editButton}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#f0f7f6] px-3 text-xs font-bold text-brand transition-colors hover:bg-[#e4f2ef] md:text-sm"
          >
            <Headphones className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{labels.helpCenter}</span>
          </button>
          <button
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#f5f5f5] px-3 text-xs font-bold text-foreground/75 transition-colors hover:bg-[#ececec] md:text-sm"
          >
            <CircleHelp className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{labels.whenReceiveContract}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {editButton}
      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f0f7f6] px-4 text-sm font-bold text-brand transition-colors hover:bg-[#e4f2ef]"
      >
        <Headphones className="size-4" aria-hidden="true" />
        {labels.helpCenter}
      </button>
    </div>
  );
}
