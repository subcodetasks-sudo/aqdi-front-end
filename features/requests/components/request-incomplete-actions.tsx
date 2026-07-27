"use client";

import { useState } from "react";

import RequestEditContractButton from "@/features/requests/components/request-edit-contract-button";
import RequestIncompleteProgressDialog, {
  type RequestIncompleteProgressDialogLabels,
} from "@/features/requests/components/request-incomplete-progress-dialog";
import type { RequestCardData } from "@/features/requests/types/request";
import { cn } from "@/lib/utils";

type RequestIncompleteActionsProps = {
  card: Pick<
    RequestCardData,
    "uuid" | "requestNumber" | "contractType" | "step"
  >;
  isIncompleteDraft: boolean;
  completeLabel: string;
  viewLabel: string;
  editErrorLabel: string;
  unitTypeLabel: string;
  contractTypeFullLabel: string;
  progressLabels: RequestIncompleteProgressDialogLabels;
};

export default function RequestIncompleteActions({
  card,
  isIncompleteDraft = false,
  completeLabel,
  viewLabel,
  editErrorLabel,
  unitTypeLabel,
  contractTypeFullLabel,
  progressLabels,
}: RequestIncompleteActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cn("flex flex-wrap items-center justify-end gap-2 border-[#f0f0f0] pt-4 dark:border-[#262d2c]", isIncompleteDraft ? "" : " border-t")}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#e8e8e8] bg-white px-5 text-sm font-bold text-brand transition-colors hover:bg-[#fafafa] dark:border-[#262d2c] dark:bg-[#151c1b] dark:text-white dark:hover:bg-[#1a2221]"
        >
          {viewLabel}
        </button>

        <RequestEditContractButton
          uuid={card.uuid}
          contractType={card.contractType}
          label={completeLabel}
          errorLabel={editErrorLabel}
          showIcon={false}
          className="rounded-2xl bg-brand px-5 text-white hover:bg-brand/90 hover:text-white dark:bg-[#00a67e] dark:hover:bg-[#00a67e]/90"
        />
      </div>

      <RequestIncompleteProgressDialog
        open={open}
        onOpenChange={setOpen}
        card={card}
        unitTypeLabel={unitTypeLabel}
        contractTypeFullLabel={contractTypeFullLabel}
        continueErrorLabel={editErrorLabel}
        labels={progressLabels}
      />
    </>
  );
}
