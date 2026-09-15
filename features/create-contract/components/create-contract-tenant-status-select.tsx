"use client";

import { useTranslations } from "next-intl";

import CreateContractFieldError from "@/features/create-contract/components/create-contract-field-error";
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
  const t = useTranslations("createContract");
  const selectedValue = value || "individual";

  return (
    <div className="flex flex-wrap items-center gap-2" data-field-invalid={invalid ? "true" : undefined}>
      <label
        className={cn(
          "shrink-0 text-xs font-semibold sm:text-sm",
          invalid ? "text-[#c62828]" : "text-black",
        )}
      >
        {labels.label}
        <span className="text-red-500"> *</span>
      </label>

      <div
        role="radiogroup"
        aria-label={labels.label}
        aria-invalid={invalid}
        className={cn(
          "flex h-8 min-w-0 items-center rounded-full bg-[#f0f0f0] p-0.5",
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
                "h-7 rounded-full px-2.5 text-[11px] font-bold whitespace-nowrap transition-colors sm:px-3 sm:text-xs",
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

      {invalid ? <CreateContractFieldError message={t("fieldRequired")} /> : null}
    </div>
  );
}
