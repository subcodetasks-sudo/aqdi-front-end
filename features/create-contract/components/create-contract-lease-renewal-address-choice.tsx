"use client";

import { Check, MapPin, PenLine } from "lucide-react";
import { useId } from "react";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import type { LeaseRenewalAddressMode } from "@/features/create-contract/types/lease-renewal-address-mode";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { cn } from "@/lib/utils";

type CreateContractLeaseRenewalAddressChoiceProps = {
  labels: CreateContractLabels["deed"]["leaseRenewal"];
  value: LeaseRenewalAddressMode;
  onChange: (value: LeaseRenewalAddressMode) => void;
};

const OPTIONS: {
  id: LeaseRenewalAddressMode;
  icon: "pin" | "pen";
}[] = [
  { id: "same", icon: "pin" },
  { id: "change", icon: "pen" },
];

export default function CreateContractLeaseRenewalAddressChoice({
  labels,
  value,
  onChange,
}: CreateContractLeaseRenewalAddressChoiceProps) {
  const groupId = useId();

  return (
    <div className="space-y-4">
      <CreateContractFieldLabel label={labels.addressFieldLabel} />

      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="grid grid-cols-2 gap-2 sm:gap-3"
      >
        <span id={groupId} className="sr-only">
          {labels.addressFieldLabel}
        </span>

        {OPTIONS.map((option) => {
          const selected = value === option.id;
          const copy =
            option.id === "same" ? labels.sameAddress : labels.changeAddress;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center transition-colors sm:min-h-30 sm:px-4 sm:py-5",
                selected
                  ? "border-brand bg-brand-background-green/70 shadow-[0_0_0_1px_rgba(13,90,80,0.08)]"
                  : "border-[#e8e8e8] bg-white hover:border-brand/30",
              )}
            >
              {option.icon === "pin" ? (
                <MapPin
                  className="size-7 text-[#e86b8a]"
                  fill="currentColor"
                  aria-hidden="true"
                />
              ) : (
                <PenLine className="size-6 text-[#333333]" aria-hidden="true" />
              )}
              <span className="text-sm font-extrabold text-[#222222]">
                {copy.title}
              </span>
              <span className="text-xs leading-relaxed text-[#8a8a8a]">
                {copy.description}
              </span>
            </button>
          );
        })}
      </div>

      {value === "same" ? (
        <div className="flex items-start gap-2 rounded-2xl border border-[#cfe0f5] bg-[#eef5fc] px-4 py-3 text-start text-sm leading-relaxed text-[#3d5a80]">
          <Check
            className="mt-0.5 size-4 shrink-0 text-[#3d5a80]"
            strokeWidth={3}
            aria-hidden="true"
          />
          <p>{labels.sameAddressConfirmation}</p>
        </div>
      ) : null}
    </div>
  );
}
