"use client";

import { List } from "lucide-react";
import { useState } from "react";

import RequestCompletedContractDialog from "@/features/requests/components/request-completed-contract-dialog";
import type { RequestContractDialogLabels } from "@/features/requests/utils/map-completed-contract-to-details";
import { cn } from "@/lib/utils";

type RequestViewContractButtonProps = {
  contractId: number;
  uuid: string;
  requestNumber: string;
  label: string;
  loadErrorLabel: string;
  detailsLabels: RequestContractDialogLabels;
  className?: string;
};

export default function RequestViewContractButton({
  contractId,
  uuid,
  requestNumber,
  label,
  loadErrorLabel,
  detailsLabels,
  className,
}: RequestViewContractButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#e8e8e8] bg-white px-4 text-sm font-bold text-brand transition-colors hover:bg-[#fafafa] dark:border-[#262d2c] dark:bg-[#151c1b] dark:text-white dark:hover:bg-[#1a2221]",
          className,
        )}
      >
        <List className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </button>

      <RequestCompletedContractDialog
        open={open}
        onOpenChange={setOpen}
        contractId={contractId}
        uuid={uuid}
        requestNumber={requestNumber}
        labels={detailsLabels}
        loadErrorLabel={loadErrorLabel}
      />
    </>
  );
}
