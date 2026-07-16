"use client";

import { ChevronLeft, ClipboardList, CreditCard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type PaymentMethod = "draft" | "pay-now";

type CreateContractPaymentMethodDialogProps = {
  labels: CreateContractLabels["payment"]["methodDialog"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean;
  onSelect: (method: PaymentMethod) => void | Promise<void>;
};

export default function CreateContractPaymentMethodDialog({
  labels,
  open,
  onOpenChange,
  isSubmitting = false,
  onSelect,
}: CreateContractPaymentMethodDialogProps) {
  async function handleSelect(method: PaymentMethod) {
    if (isSubmitting) {
      return;
    }

    await onSelect(method);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl border-0 p-6 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">{labels.title}</DialogTitle>

        <div className="flex items-center justify-center text-center text-brand! ">
          <span className="text-base font-bold md:text-xl">
            {labels.title}
          </span>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-[#7f7f7f]">
          {labels.question}
        </p>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSelect("draft")}
            className={cn(
              "flex w-full items-center gap-3 rounded-[2rem] bg-brand-background px-4 py-4 text-start transition-opacity",
              "hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <ClipboardList
                className="size-6 text-brand"
                aria-hidden="true"
              />
            </span>


            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-bold leading-snug text-[#333333] md:text-base">
                {labels.draft.title}
              </p>
              <p className="text-xs leading-relaxed text-[#7f7f7f] md:text-sm">
                {labels.draft.description}
              </p>
            </div>

            <ChevronLeft
              className="size-5 shrink-0 text-[#bdbdbd]"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSelect("pay-now")}
            className={cn(
              "flex w-full items-center gap-3 rounded-[2rem] border border-[#b8d9f5] bg-[#eef6ff] px-4 py-4 text-start transition-opacity",
              "hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >

<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <CreditCard className="size-6 text-brand" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-bold leading-snug text-[#333333] md:text-base">
                {labels.payNow.title}
              </p>
              <p className="text-xs leading-relaxed text-[#7f7f7f] md:text-sm">
                {labels.payNow.description}
              </p>
            </div>

            <ChevronLeft
              className="size-5 shrink-0 text-[#bdbdbd]"
              aria-hidden="true"
            />

          </button>
        </div>

        {isSubmitting ? (
          <p className="mt-4 text-center text-xs text-[#7f7f7f]">
            {labels.submitting}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export type { PaymentMethod };
