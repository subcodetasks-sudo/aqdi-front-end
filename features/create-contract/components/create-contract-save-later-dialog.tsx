"use client";

import { Check, Copy, Hand, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CustomIcon from "@/features/shared/components/custom-icon";
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
  orderNumber?: string;
};

export default function CreateContractSaveLaterDialog({
  labels,
  open,
  onOpenChange,
  orderNumber,
}: CreateContractSaveLaterDialogProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!orderNumber) {
      return;
    }

    try {
      await navigator.clipboard.writeText(`#${orderNumber}`);
      setCopied(true);
      toast.success(labels.copySuccess);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(labels.copyError);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl p-6 sm:max-w-md"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ececec] pb-4">
          <DialogTitle className="text-base font-bold leading-snug text-brand">
            {labels.title}
          </DialogTitle>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label={labels.close}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 text-center">
          <div className="size-16 rounded-full bg-brand-secondary flex items-center justify-center shadow-lg shadow-brand-secondary/80">
            <Check className="size-8 text-white" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-extrabold leading-relaxed text-brand">
              {labels.successTitle}
            </p>
            <p className="text-sm leading-relaxed text-[#7f7f7f]">
              {labels.successDescription}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="mt-2 flex items-end justify-between gap-3">
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-[#7f7f7f]">
                {labels.orderNumberLabel}
              </p>

              <p className="text-2xl font-extrabold text-[#333333]">
                #{orderNumber ?? "—"}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleCopy}
              className="h-9 gap-1.5 rounded-full bg-brand px-3 text-xs font-semibold text-white hover:bg-brand-secondary/90"
            >
              {copied ? labels.copied : labels.copy}
              <Copy className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-secondary/30 bg-brand-background-green px-4 py-3">
          <Hand
            className="size-5 shrink-0 text-brand-secondary"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-[#333333]">
            {labels.retentionNotice}{" "}
            <span className="font-bold">{labels.retentionDays}</span>
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            asChild
            className="h-12 flex-1 rounded-full bg-brand text-base font-bold text-white hover:bg-brand/90"
          >
            <Link href={labels.mainMenuHref}>{labels.mainMenu}</Link>
          </Button>
          <Button
            type="button"
            asChild
            className="h-12 flex-1 rounded-full bg-brand-secondary text-base font-bold text-white hover:bg-brand-secondary/90"
          >
            <Link href={labels.ordersHref}>{labels.orders}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
