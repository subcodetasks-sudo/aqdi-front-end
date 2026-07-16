"use client";

import { AlertCircle, Copy, Phone } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import CustomIcon from "@/features/shared/components/custom-icon";

type CreateContractDraftSuccessDialogProps = {
  labels: CreateContractLabels["payment"]["draftSuccessDialog"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderUuid: string | null;
};

function formatOrderNumber(uuid: string | null) {
  if (!uuid?.trim()) {
    return "—";
  }

  return uuid.startsWith("#") ? uuid : `#${uuid}`;
}

export default function CreateContractDraftSuccessDialog({
  labels,
  open,
  onOpenChange,
  orderUuid,
}: CreateContractDraftSuccessDialogProps) {
  const orderNumber = formatOrderNumber(orderUuid);

  async function handleCopy() {
    if (!orderUuid?.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatOrderNumber(orderUuid));
      toast.success(labels.copySuccess);
    } catch {
      toast.error(labels.copyError);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl border-0 p-6 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">{labels.title}</DialogTitle>

        <div className="flex flex-col items-center gap-3 text-center">
          <CustomIcon
            src="/icons/shiled-check.svg"
            size={72}
            className="text-brand-secondary"
          />

          <p className="text-xl font-extrabold leading-relaxed text-brand md:text-2xl">
            {labels.title}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-[#f2c7c7] bg-[#fff5f5] px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div className="space-y-1 text-start">
              <p className="text-sm font-bold text-destructive">
                {labels.paymentStatusLabel}
              </p>
              <p className="text-xs leading-relaxed text-[#7f7f7f] md:text-sm">
                {labels.paymentStatusDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-brand-background-green px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-1 text-start">
              <p className="text-xs font-medium text-[#7f7f7f]">
                {labels.orderNumberLabel}
              </p>
              <p className="truncate text-xl font-extrabold tracking-wide text-[#1f2937] md:text-2xl">
                {orderNumber}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleCopy()}
              disabled={!orderUuid?.trim()}
              className="h-9 shrink-0 rounded-full border-brand/20 bg-white px-3 text-xs font-semibold text-brand hover:bg-brand-background"
            >
              <Copy className="size-3.5" aria-hidden="true" />
              {labels.copy}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-[#4b5563] md:text-sm">
            {labels.preparationDescription}
          </p>
        </div>

        <Button
          asChild
          className="mt-6 h-12 w-full rounded-full bg-brand text-base font-bold text-white hover:bg-brand/90"
        >
          <Link href={labels.whatsappHref} target="_blank" rel="noopener noreferrer">
            <Phone className="size-4" aria-hidden="true" />
            {labels.whatsappCta}
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
