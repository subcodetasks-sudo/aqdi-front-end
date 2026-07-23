"use client";

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
  invalid?: boolean;
};

export default function CreateContractTenantStatusSelect({
  labels,
  value,
  onChange,
  invalid = false,
}: CreateContractTenantStatusSelectProps) {
  const selectedValue = value || "individual";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label
        className={cn(
          "shrink-0 text-sm font-semibold",
          invalid ? "text-[#c62828]" : "text-brand",
        )}
      >
        {labels.label}
        <span className="text-red-500"> *</span>
      </label>

      <div
        role="radiogroup"
        aria-label={labels.label}
        className={cn(
          "flex min-w-0 items-center rounded-full bg-[#f0f0f0] p-1",
          invalid && "ring-1 ring-[#e57373]",
        )}
      >
        {TENANT_STATUS_OPTIONS.map((status) => {
          const selected = selectedValue === status;

          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(status)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors",
                selected
                  ? "bg-brand text-white shadow-sm"
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
