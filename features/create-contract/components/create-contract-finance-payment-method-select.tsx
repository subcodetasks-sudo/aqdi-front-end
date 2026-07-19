"use client";

import { Hand } from "lucide-react";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import { cn } from "@/lib/utils";

export type FinancePaymentMethodOption = {
  value: string;
  title: string;
};

type CreateContractFinancePaymentMethodSelectProps = {
  label: string;
  options: FinancePaymentMethodOption[];
  value: string;
  note?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function CreateContractFinancePaymentMethodSelect({
  label,
  options,
  value,
  note,
  disabled = false,
  onChange,
}: CreateContractFinancePaymentMethodSelectProps) {
  return (
    <div>
      <CreateContractFieldLabel label={label} />

      <div
        role="radiogroup"
        aria-label={label}
        className="grid w-full grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-5"
      >
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-12 items-center justify-center rounded-xl border px-2 py-2 text-center transition-colors",
                selected
                  ? "border-brand bg-brand text-white"
                  : "border-[#e8e8e8] bg-brand-background text-brand hover:border-brand/30",
                disabled && "pointer-events-none opacity-60",
              )}
            >
              <span className="text-xs font-extrabold leading-4">
                {option.title}
              </span>
            </button>
          );
        })}
      </div>

      {note ? (
        <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#555555]">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#f3ead7] text-[#e39b2d]">
            <Hand className="size-3" aria-hidden="true" />
          </span>
          <span>{note}</span>
        </p>
      ) : null}
    </div>
  );
}
