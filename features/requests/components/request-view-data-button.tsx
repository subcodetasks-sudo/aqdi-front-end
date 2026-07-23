"use client";

import { List } from "lucide-react";
import { useState } from "react";

import RequestDetailsDialog from "@/features/requests/components/request-details-dialog";
import type { RequestDetailsDialogLabels } from "@/features/requests/utils/map-contract-to-request-details";
import { cn } from "@/lib/utils";

type RequestViewDataButtonProps = {
  uuid: string;
  requestNumber: string;
  label: string;
  loadErrorLabel: string;
  detailsLabels: RequestDetailsDialogLabels;
  className?: string;
};

export default function RequestViewDataButton({
  uuid,
  requestNumber,
  label,
  loadErrorLabel,
  detailsLabels,
  className,
}: RequestViewDataButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#e8e8e8] bg-white px-4 text-sm font-bold text-brand transition-colors hover:bg-[#fafafa]",
          className,
        )}
      >
        <List className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </button>

      <RequestDetailsDialog
        open={open}
        onOpenChange={setOpen}
        uuid={uuid}
        requestNumber={requestNumber}
        labels={detailsLabels}
        loadErrorLabel={loadErrorLabel}
      />
    </>
  );
}
