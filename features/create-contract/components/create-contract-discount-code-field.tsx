"use client";

import { Tag } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { AppliedContractCoupon } from "@/features/create-contract/types/contract-coupon";

type CreateContractDiscountCodeFieldProps = {
  labels: CreateContractLabels["payment"]["discountCode"];
  appliedCoupon: AppliedContractCoupon | null;
  isApplying: boolean;
  onApply: (code: string) => Promise<boolean>;
  onClear: () => void;
};

export default function CreateContractDiscountCodeField({
  labels,
  appliedCoupon,
  isApplying,
  onApply,
  onClear,
}: CreateContractDiscountCodeFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isLocked = Boolean(appliedCoupon);
  const [isExpanded, setIsExpanded] = useState(isLocked);
  const [draft, setDraft] = useState(appliedCoupon?.code ?? "");

  useEffect(() => {
    if (appliedCoupon) {
      setDraft(appliedCoupon.code);
      setIsExpanded(true);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    if (!isExpanded || isLocked) {
      return;
    }

    inputRef.current?.focus();
  }, [isExpanded, isLocked]);

  function handleExpand() {
    if (isLocked) {
      return;
    }

    setIsExpanded(true);
  }

  async function handleApply() {
    if (isLocked || isApplying || !draft.trim()) {
      return;
    }

    await onApply(draft.trim());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (isLocked || isApplying) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      void handleApply();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setDraft("");
      onClear();
      setIsExpanded(false);
    }
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={handleExpand}
        className="flex w-full items-center gap-2 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-4 text-start transition-colors hover:border-brand/20 hover:bg-brand-background/40"
      >
        <Tag className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <span className="text-sm font-bold text-brand">{labels.question}</span>
        <span className="text-sm text-[#9a9a9a]">{labels.add}</span>
      </button>
    );
  }

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3"
    >
      <div className="mb-3 flex items-center gap-2">
        <Tag className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <label htmlFor={inputId} className="text-sm font-bold text-brand">
          {labels.question}
        </label>
        {!isLocked ? (
          <span className="text-sm text-[#9a9a9a]">{labels.add}</span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={labels.placeholder}
          autoComplete="off"
          disabled={isLocked || isApplying}
          className="h-11 flex-1 rounded-xl border-[#e8e8e8] bg-white px-3 text-sm shadow-none placeholder:text-[#b0b0b0] focus-visible:border-brand focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-70"
        />

        {!isLocked ? (
          <Button
            type="button"
            onClick={() => void handleApply()}
            disabled={!draft.trim() || isApplying}
            className="h-11 shrink-0 rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-secondary disabled:opacity-50"
          >
            {isApplying ? labels.applying : labels.apply}
          </Button>
        ) : null}
      </div>

      {appliedCoupon ? (
        <p className="mt-2 text-sm font-medium leading-relaxed text-brand-secondary">
          {appliedCoupon.message}
        </p>
      ) : null}
    </div>
  );
}
