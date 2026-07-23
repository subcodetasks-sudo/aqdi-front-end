"use client";

import { Briefcase, ScrollText } from "lucide-react";
import type { ReactNode } from "react";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  DELEGATION_TYPE_OPTIONS,
  type DelegationTypeOption,
} from "@/features/create-contract/types/tenant-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { cn } from "@/lib/utils";

type CreateContractTenantDelegationTypeSelectProps = {
  labels: CreateContractLabels["tenant"]["organizationData"]["delegationType"];
  value: DelegationTypeOption | "";
  onChange: (value: DelegationTypeOption | "") => void;
  invalid?: boolean;
};

const DELEGATION_ICONS: Record<DelegationTypeOption, ReactNode> = {
  "owner-representative": (
    <Briefcase className="size-7 text-[#8a6a3a]" aria-hidden />
  ),
  "agent-authorized": (
    <ScrollText className="size-7 text-[#6b5b95]" aria-hidden />
  ),
};

export default function CreateContractTenantDelegationTypeSelect({
  labels,
  value,
  onChange,
  invalid = false,
}: CreateContractTenantDelegationTypeSelectProps) {
  return (
    <div>
      <CreateContractFieldLabel label={labels.label} invalid={invalid} />

      <div
        role="radiogroup"
        aria-label={labels.label}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {DELEGATION_TYPE_OPTIONS.map((delegationType) => {
          const selected = value === delegationType;
          const option = labels.options[delegationType];

          return (
            <button
              key={delegationType}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(delegationType)}
              className={cn(
                "relative flex flex-col items-center gap-2.5 rounded-2xl border px-4 py-5 text-center transition-colors",
                selected
                  ? "border-brand bg-brand-background-green"
                  : invalid
                    ? "border-[#e57373] bg-white"
                    : "border-[#e8e8e8] bg-white hover:border-brand/30",
              )}
            >
              {"badge" in option && option.badge ? (
                <span className="absolute inset-s-3 top-0 -translate-y-1/2 rounded-full bg-[#ffe8d6] px-2.5 py-1 text-[10px] font-bold text-[#b86a3a]">
                  {option.badge}
                </span>
              ) : null}

              <span className="flex size-11 items-center justify-center">
                {DELEGATION_ICONS[delegationType]}
              </span>
              <span className="text-sm font-extrabold text-brand">
                {option.title}
              </span>
              <span className="text-xs leading-5 text-[#9a9a9a]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
