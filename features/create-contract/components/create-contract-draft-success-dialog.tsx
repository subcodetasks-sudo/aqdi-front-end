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
        className="gap-0 overflow-hidden rounded-3xl border-0 bg-white p-6 sm:max-w-lg dark:bg-[#1a2421] dark:text-white"
      >
        <DialogTitle className="sr-only">{labels.title}</DialogTitle>

        <div className="flex flex-col items-center gap-3 text-center">
          <CustomIcon
            src="/icons/shiled-check.svg"
            size={72}
            className="text-brand-secondary dark:text-[#7dccc0]"
          />

          <p className="text-xl font-extrabold leading-relaxed text-brand md:text-2xl dark:text-[#7dccc0]">
            {labels.title}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-[#f2c7c7] bg-[#fff5f5] px-4 py-3 dark:border-[#5c2a2a] dark:bg-[#2a1818]">
          <div className="flex items-start gap-2">
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-destructive dark:text-[#f87171]"
              aria-hidden="true"
            />
            <div className="space-y-1 text-start">
              <p className="text-sm font-bold text-destructive dark:text-[#f87171]">
                {labels.paymentStatusLabel}
              </p>
              <p className="text-xs leading-relaxed text-[#555555] md:text-sm dark:text-[#e8c4c4]">
                {labels.paymentStatusDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-brand-background-green px-4 py-4 dark:bg-[#121a18]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-2 text-start">
              <p className="text-xs font-medium text-[#5c6b68] dark:text-[#9eb5af]">
                {labels.orderNumberLabel}
              </p>
              <p className="inline-flex max-w-full truncate rounded-lg bg-[#2563eb] px-3 py-1.5 text-lg font-extrabold tracking-wide text-white md:text-xl">
                {orderNumber}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleCopy()}
              disabled={!orderUuid?.trim()}
              className="h-9 shrink-0 rounded-full border-brand/20 bg-white px-3 text-xs font-semibold text-brand hover:bg-brand-background dark:border-[#2f403b] dark:bg-[#1a2421] dark:text-[#7dccc0] dark:hover:bg-[#24302c]"
            >
              <Copy className="size-3.5" aria-hidden="true" />
              {labels.copy}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-[#35584a] md:text-sm dark:text-[#c5d6d1]">
            {labels.preparationDescription}
          </p>
        </div>

        <Button
          asChild
          className="mt-6 h-12 w-full rounded-full bg-brand text-base font-bold text-white hover:bg-brand/90 dark:bg-[#0f6b5c]"
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
