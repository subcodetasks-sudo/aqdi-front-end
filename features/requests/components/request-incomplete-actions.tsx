"use client";

import { useState } from "react";

import RequestEditContractButton from "@/features/requests/components/request-edit-contract-button";
import RequestIncompleteProgressDialog, {
  type RequestIncompleteProgressDialogLabels,
} from "@/features/requests/components/request-incomplete-progress-dialog";
import type { RequestCardData } from "@/features/requests/types/request";

type RequestIncompleteActionsProps = {
  card: Pick<
    RequestCardData,
    "uuid" | "requestNumber" | "contractType" | "step"
  >;
  completeLabel: string;
  viewLabel: string;
  editErrorLabel: string;
  unitTypeLabel: string;
  contractTypeFullLabel: string;
  progressLabels: RequestIncompleteProgressDialogLabels;
};

export default function RequestIncompleteActions({
  card,
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
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#f0f0f0] pt-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#e8e8e8] bg-white px-5 text-sm font-bold text-brand transition-colors hover:bg-[#fafafa]"
        >
          {viewLabel}
        </button>

        <RequestEditContractButton
          uuid={card.uuid}
          contractType={card.contractType}
          label={completeLabel}
          errorLabel={editErrorLabel}
          showIcon={false}
          className="rounded-2xl bg-brand px-5 text-white hover:bg-brand/90 hover:text-white"
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
