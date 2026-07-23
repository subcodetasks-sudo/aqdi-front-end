"use client";

import { Lock, Search } from "lucide-react";

type CreateContractPaymentHeroProps = {
  journeyMessage: string;
  securePaymentLabel: string;
  reviewOrderLabel: string;
  onReviewOrder: () => void;
};

export default function CreateContractPaymentHero({
  journeyMessage,
  securePaymentLabel,
  reviewOrderLabel,
  onReviewOrder,
}: CreateContractPaymentHeroProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 border-t border-dashed border-[#d4d4d4]" />
        <p className="shrink-0 text-center text-sm font-semibold text-brand">
          {journeyMessage}
        </p>
        <span className="h-px flex-1 border-t border-dashed border-[#d4d4d4]" />
      </div>

      <div className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-background-green px-4">
        <span className="text-sm font-bold text-brand">{securePaymentLabel}</span>
        <Lock className="size-4 shrink-0 text-[#e39b2d]" aria-hidden="true" />
      </div>

      <button
        type="button"
        onClick={onReviewOrder}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#e8e8e8] bg-white px-4 text-sm font-bold text-brand transition-colors hover:bg-brand-background"
      >
        <span>{reviewOrderLabel}</span>
        <Search className="size-4 shrink-0 text-brand" aria-hidden="true" />
      </button>
    </div>
  );
}
