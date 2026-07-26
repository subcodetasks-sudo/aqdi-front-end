"use client";

import { Check, MapPin, PenLine } from "lucide-react";
import { useId } from "react";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { LeaseRenewalUnitMode } from "@/features/create-contract/types/lease-renewal-unit-mode";
import { cn } from "@/lib/utils";

type CreateContractLeaseRenewalUnitChoiceProps = {
  labels: CreateContractLabels["tenant"]["leaseRenewal"];
  value: LeaseRenewalUnitMode;
  onChange: (value: LeaseRenewalUnitMode) => void;
};

const OPTIONS: {
  id: LeaseRenewalUnitMode;
  icon: "pin" | "pen";
}[] = [
  { id: "same", icon: "pin" },
  { id: "change", icon: "pen" },
];

export default function CreateContractLeaseRenewalUnitChoice({
  labels,
  value,
  onChange,
}: CreateContractLeaseRenewalUnitChoiceProps) {
  const groupId = useId();

  return (
    <div className="space-y-4">
      <CreateContractFieldLabel label={labels.unitFieldLabel} />

      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <span id={groupId} className="sr-only">
          {labels.unitFieldLabel}
        </span>

        {OPTIONS.map((option) => {
          const selected = value === option.id;
          const copy =
            option.id === "same" ? labels.sameUnit : labels.changeUnit;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex min-h-30 flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-5 text-center transition-colors",
                selected
                  ? "border-brand bg-brand-background-green/70 shadow-[0_0_0_1px_rgba(13,90,80,0.08)]"
                  : "border-[#e8e8e8] bg-white hover:border-brand/30",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-12 items-center justify-center rounded-full",
                  selected ? "bg-white/80" : "bg-[#f3f3f3]",
                )}
              >
                {option.icon === "pin" ? (
                  <MapPin
                    className="size-6 text-[#e86b8a]"
                    fill="currentColor"
                    aria-hidden="true"
                  />
                ) : (
                  <PenLine
                    className="size-5 text-[#333333]"
                    aria-hidden="true"
                  />
                )}
              </span>
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
          <p>{labels.sameUnitConfirmation}</p>
        </div>
      ) : null}
    </div>
  );
}
