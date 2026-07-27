"use client";

import {
  ChevronLeft,
  ClipboardList,
  CreditCard,
  X,
  Zap,
} from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { formatPaymentAmount } from "@/features/create-contract/types/payment-step";
import { cn } from "@/lib/utils";

type PaymentMethod = "draft" | "pay-now";

type CreateContractPaymentMethodDialogProps = {
  labels: CreateContractLabels["payment"]["methodDialog"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting?: boolean;
  hasDiscount?: boolean;
  totalPrice?: number;
  discountedPrice?: number | null;
  selectedMethod?: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void | Promise<void>;
};

function isPaymentStep(step: string) {
  const normalized = step.trim().toLowerCase();
  return (
    normalized === "الدفع" ||
    normalized === "payment" ||
    normalized.includes("دفع") ||
    normalized.includes("pay")
  );
}

function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {steps.map((step, i) => {
        const highlighted = isPaymentStep(step);

        return (
          <span key={`${step}-${i}`} className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-lg border px-2 py-1 text-[10px] font-bold leading-none sm:text-[11px]",
                highlighted
                  ? "border-brand/40 bg-[#e8f5ee] text-brand"
                  : "border-[#e0e0e0] bg-white text-[#555]",
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 ? (
              <ChevronLeft
                className="size-3 shrink-0 text-[#c4c4c4]"
                aria-hidden="true"
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
        selected ? "border-brand" : "border-[#cfcfcf]",
      )}
    >
      {selected ? <span className="size-2.5 rounded-full bg-brand" /> : null}
    </span>
  );
}

function MethodPrice({
  label,
  amount,
  currency,
  originalAmount,
}: {
  label: string;
  amount: number;
  currency: string;
  originalAmount?: number | null;
}) {
  return (
    <div className="mt-3 flex items-end justify-between gap-3 border-t border-dashed border-[#d9d9d9] pt-3">
      <span className="text-xs font-bold text-[#666]">{label}</span>
      <div className="flex items-baseline gap-2">
        {typeof originalAmount === "number" && originalAmount > amount ? (
          <span className="text-xs text-[#9a9a9a] line-through">
            {formatPaymentAmount(originalAmount)}
          </span>
        ) : null}
        <span className="text-base font-extrabold text-brand">
          {formatPaymentAmount(amount)} {currency}
        </span>
      </div>
    </div>
  );
}

export default function CreateContractPaymentMethodDialog({
  labels,
  open,
  onOpenChange,
  isSubmitting = false,
  hasDiscount = false,
  totalPrice = 0,
  discountedPrice = null,
  selectedMethod = null,
  onSelect,
}: CreateContractPaymentMethodDialogProps) {
  const payNowAmount =
    hasDiscount && typeof discountedPrice === "number"
      ? discountedPrice
      : totalPrice;

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
        className="scrollbar-hide max-h-[min(92vh,900px)] gap-0 overflow-y-auto rounded-[28px] border-0 bg-white p-5 sm:max-w-lg"
      >
        <div className="relative mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 text-start">
            <DialogTitle className="text-base font-extrabold text-[#1a1a1a] md:text-lg">
              {labels.title}
            </DialogTitle>
            <p className="mt-1 text-xs leading-relaxed text-[#7f7f7f]">
              {labels.subtitle}
            </p>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              aria-label={labels.close}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-[#8a8a8a] transition-colors hover:bg-[#ebebeb] hover:text-[#555]"
            >
              <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </DialogClose>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            disabled={isSubmitting}
            aria-pressed={selectedMethod === "pay-now"}
            onClick={() => void handleSelect("pay-now")}
            className={cn(
              "w-full rounded-[22px] border-2 bg-white px-3.5 py-3.5 text-start transition-colors",
              selectedMethod === "pay-now"
                ? "border-brand bg-[#f7fcf9]"
                : "border-[#e8e8e8] hover:border-[#d5d5d5]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e0e0e0] bg-white text-brand">
                <CreditCard className="size-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  {hasDiscount ? (
                    <span className="inline-flex items-center rounded-full bg-[#ffe8d6] px-2 py-0.5 text-[11px] font-extrabold text-[#b45f1a]">
                      {labels.payNow.discountBadge}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-extrabold text-white">
                    <Zap className="size-3" aria-hidden="true" />
                    {labels.payNow.badge}
                  </span>
                </div>

                <p className="text-sm font-extrabold leading-snug text-[#1a1a1a]">
                  {labels.payNow.title}
                </p>
                <p className="mt-0.5 text-xs text-[#7f7f7f]">
                  {labels.payNow.description}
                </p>

                <FlowSteps steps={labels.payNow.steps} />

                {labels.payNow.note ? (
                  <p className="mt-3 rounded-xl bg-[#e8f5ee] px-3 py-2 text-[11px] leading-relaxed text-[#2a6644]">
                    {labels.payNow.note}
                  </p>
                ) : null}

                {totalPrice > 0 ? (
                  <MethodPrice
                    label={
                      hasDiscount ? labels.afterDiscount : labels.total
                    }
                    amount={payNowAmount}
                    currency={labels.currency}
                    originalAmount={hasDiscount ? totalPrice : null}
                  />
                ) : null}
              </div>

              <RadioIndicator selected={selectedMethod === "pay-now"} />
            </div>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            aria-pressed={selectedMethod === "draft"}
            onClick={() => void handleSelect("draft")}
            className={cn(
              "w-full rounded-[22px] border-2 bg-white px-3.5 py-3.5 text-start transition-colors",
              selectedMethod === "draft"
                ? "border-brand bg-[#f7fcf9]"
                : "border-[#e8e8e8] hover:border-[#d5d5d5]",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e0e0e0] bg-white text-brand">
                <ClipboardList className="size-5" aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold leading-snug text-[#1a1a1a]">
                  {labels.draft.title}
                </p>
                <p className="mt-0.5 text-xs text-[#7f7f7f]">
                  {labels.draft.description}
                </p>

                <FlowSteps steps={labels.draft.steps} />

                {labels.draft.note ? (
                  <p className="mt-3 text-[11px] leading-relaxed text-[#6b7c76]">
                    {labels.draft.note}
                  </p>
                ) : null}

                {totalPrice > 0 ? (
                  <MethodPrice
                    label={labels.total}
                    amount={totalPrice}
                    currency={labels.currency}
                  />
                ) : null}
              </div>

              <RadioIndicator selected={selectedMethod === "draft"} />
            </div>
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-[#eef8f3] px-4 py-3 text-[11px] leading-relaxed text-[#35584a]">
          <span className="font-extrabold">{labels.footerNoteTitle}</span>{" "}
          <span>{labels.footerNote}</span>
        </div>

        {isSubmitting ? (
          <p className="mt-3 text-center text-xs text-[#7f7f7f]">
            {labels.submitting}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export type { PaymentMethod };
