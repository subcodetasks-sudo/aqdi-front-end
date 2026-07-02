import { CircleHelp, CreditCard, Headphones } from "lucide-react";
import Link from "next/link";

import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestCardLabels } from "@/features/requests/types/request-labels";

type RequestCardActionsProps = {
  card: Pick<RequestCardData, "actionType" | "contractType">;
  labels: RequestCardLabels;
};

function getCreateContractHref(contractType: RequestCardData["contractType"]) {
  return contractType === "commercial"
    ? "/create-contract?id=commercial"
    : "/create-contract?id=residential";
}

export default function RequestCardActions({
  card,
  labels,
}: RequestCardActionsProps) {
  if (card.actionType === "complete-payment") {
    return (
      <div className="space-y-3">
        <p className="text-center text-xs font-medium text-muted-foreground">
          {labels.completePaymentHint}
        </p>
        <Link
          href={getCreateContractHref(card.contractType)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-l from-brand-secondary to-brand px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <CreditCard className="size-4" aria-hidden="true" />
          {labels.completePayment}
        </Link>
      </div>
    );
  }

  if (card.actionType === "dual-actions") {
    return (
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
    );
  }

  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f0f7f6] px-4 text-sm font-bold text-brand transition-colors hover:bg-[#e4f2ef]"
    >
      <Headphones className="size-4" aria-hidden="true" />
      {labels.helpCenter}
    </button>
  );
}
