"use client";

import { Lightbulb, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractSaveLaterDialogProps = {
  labels: CreateContractLabels["tenant"]["saveLaterDialog"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber?: string | number | null;
  isSaving?: boolean;
  onConfirm: () => void;
};

function SaveProgressIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="14" y="10" width="44" height="52" rx="6" fill="#7B6CF0" />
      <rect x="20" y="10" width="32" height="14" rx="2" fill="#E8E4FF" />
      <rect x="24" y="14" width="10" height="6" rx="1" fill="#5B4FD1" />
      <rect x="20" y="32" width="32" height="24" rx="3" fill="#F5F3FF" />
      <rect x="26" y="38" width="20" height="3" rx="1.5" fill="#C4BDF5" />
      <rect x="26" y="46" width="14" height="3" rx="1.5" fill="#C4BDF5" />
    </svg>
  );
}

export default function CreateContractSaveLaterDialog({
  labels,
  open,
  onOpenChange,
  orderNumber,
  isSaving = false,
  onConfirm,
}: CreateContractSaveLaterDialogProps) {
  const resolvedOrderNumber =
    orderNumber != null && String(orderNumber).trim() !== ""
      ? String(orderNumber)
      : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl border-0 bg-white p-6 shadow-2xl sm:max-w-md"
      >
        <div className="relative flex items-center justify-center">
          <DialogTitle className="text-center text-[15px] font-bold text-[#1a1a1a]">
            {labels.title}
          </DialogTitle>

          <DialogClose asChild>
            <button
              type="button"
              aria-label={labels.close}
              disabled={isSaving}
              className="absolute start-0 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#9a9a9a] transition-colors hover:bg-[#e8e8e8] hover:text-[#666] disabled:opacity-50"
            >
              <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </DialogClose>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <SaveProgressIcon />

          <div className="space-y-2 px-1">
            <p className="text-[22px] font-extrabold leading-snug text-brand md:text-2xl">
              {labels.successTitle}
            </p>
            <p className="text-sm leading-6 text-[#8f8f8f]">
              {labels.successDescription}
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#ececec] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-[#f0f0f0] px-4 py-3">
            <span className="text-sm text-[#8f8f8f]">{labels.orderNumberLabel}</span>
            <span className="text-sm font-extrabold text-[#222222]">
              #{resolvedOrderNumber}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-[#f0f0f0] px-4 py-3">
            <span className="text-sm text-[#8f8f8f]">{labels.foundInLabel}</span>
            <span className="text-sm font-extrabold text-[#222222]">
              {labels.foundInValue}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-[#8f8f8f]">{labels.retentionLabel}</span>
            <span className="text-sm font-extrabold text-[#222222]">
              {labels.retentionDays}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 px-1">
          <Lightbulb
            className="mt-0.5 size-4 shrink-0 text-[#e39b2d]"
            aria-hidden="true"
          />
          <p className="text-xs leading-5 text-[#8f8f8f]">{labels.tip}</p>
        </div>

        <Button
          type="button"
          disabled={isSaving}
          onClick={onConfirm}
          className="mt-5 h-12 w-full rounded-2xl bg-brand text-[15px] font-bold text-white hover:bg-brand/90"
        >
          {isSaving ? labels.saving : labels.confirm}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
