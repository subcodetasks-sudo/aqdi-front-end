"use client";

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
  invalid?: boolean;
  onChange: (value: string) => void;
};

export default function CreateContractFinancePaymentMethodSelect({
  label,
  options,
  value,
  note,
  disabled = false,
  invalid = false,
  onChange,
}: CreateContractFinancePaymentMethodSelectProps) {
  return (
    <div>
      <CreateContractFieldLabel label={label} invalid={invalid} />

      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-2"
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
                "min-h-11 rounded-2xl border px-3.5 py-2.5 text-center text-xs font-bold transition-colors sm:text-sm",
                selected
                  ? "border-brand bg-brand text-white"
                  : invalid
                    ? "border-[#e57373] bg-brand-background text-brand"
                    : "border-[#e8e8e8] bg-brand-background text-[#555555] hover:border-brand/30",
                disabled && "pointer-events-none opacity-60",
              )}
            >
              {option.title}
            </button>
          );
        })}
      </div>

      {note ? (
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-background-green px-3.5 py-3">
          <span
            className="mt-1.5 size-2 shrink-0 rounded-full bg-[#e39b2d]"
            aria-hidden="true"
          />
          <p className="text-sm leading-6 font-medium text-brand">{note}</p>
        </div>
      ) : null}
    </div>
  );
}
