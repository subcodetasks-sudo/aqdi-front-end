"use client";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  TENANT_STATUS_OPTIONS,
  type TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { cn } from "@/lib/utils";

type CreateContractTenantStatusSelectProps = {
  labels: CreateContractLabels["tenant"]["tenantStatus"];
  value: TenantStatusOption | "";
  onChange: (value: TenantStatusOption | "") => void;
};

export default function CreateContractTenantStatusSelect({
  labels,
  value,
  onChange,
}: CreateContractTenantStatusSelectProps) {
  return (
    <div>
      <CreateContractFieldLabel label={labels.label} />

      <div
        role="radiogroup"
        aria-label={labels.label}
        className="flex w-full items-center rounded-full border border-[#e8e8e8] bg-brand-background p-1"
      >
        {TENANT_STATUS_OPTIONS.map((status) => {
          const selected = value === status;

          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(status)}
              className={cn(
                "flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-colors",
                selected
                  ? "bg-brand text-white"
                  : "text-[#7f7f7f] hover:text-[#555555]",
              )}
            >
              {labels.options[status]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
