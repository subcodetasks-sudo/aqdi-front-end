import { BadgeCheck, Check } from "lucide-react";

import RequestEditContractButton from "@/features/requests/components/request-edit-contract-button";
import type { RequestCardData } from "@/features/requests/types/request";
import type { RequestCardLabels } from "@/features/requests/types/request-labels";
import { cn } from "@/lib/utils";

type RequestCardBadgesProps = {
  card: Pick<
    RequestCardData,
    | "status"
    | "statusName"
    | "statusColor"
    | "paymentSuccessful"
    | "showViewEdit"
    | "uuid"
    | "contractType"
  >;
  labels: RequestCardLabels;
};

function StatusDot({ className }: { className?: string }) {
  return (
    <span
      className={cn("size-1.5 shrink-0 rounded-full bg-white", className)}
      aria-hidden="true"
    />
  );
}

export default function RequestCardBadges({
  card,
  labels,
}: RequestCardBadgesProps) {
  const statusLabel =
    card.status === "completed"
      ? labels.status.completed
      : card.status === "incomplete"
        ? labels.status.incomplete
        : card.status === "in-progress"
          ? labels.status.inProgress
          : labels.status.returned;

  const hasApiStatus = Boolean(card.statusName);

  return (
    <div className="flex flex-col items-end gap-2">
      {card.showViewEdit ? (
        <RequestEditContractButton
          uuid={card.uuid}
          contractType={card.contractType}
          label={labels.viewOrEdit}
          errorLabel={labels.editError}
        />
      ) : null}

      {card.paymentSuccessful ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-background-green px-3 py-1.5 text-[11px] font-semibold text-brand-secondary">
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          {labels.paymentSuccessful}
        </span>
      ) : null}

      {hasApiStatus ? (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white"
          style={{ backgroundColor: card.statusColor ?? "#1a1a1a" }}
        >
          <StatusDot />
          {card.statusName}
        </span>
      ) : (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white",
            card.status === "completed" && "bg-[#1a1a1a]",
            card.status === "incomplete" && "bg-[#fff0f0] text-[#e53935]",
            card.status === "in-progress" && "bg-brand-secondary",
            card.status === "returned" && "bg-[#8b5cf6]",
          )}
        >
          {card.status === "incomplete" ? (
            <StatusDot className="bg-[#e53935]" />
          ) : (
            <StatusDot />
          )}
          {statusLabel}
        </span>
      )}
    </div>
  );
}
