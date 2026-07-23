"use client";

import { Hand } from "lucide-react";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import { cn } from "@/lib/utils";

export type FinanceDurationOption = {
  value: string;
  title: string;
  fee?: string;
  feeLabel?: string;
};

type CreateContractFinanceDurationSelectProps = {
  label: string;
  placeholder: string;
  options: FinanceDurationOption[];
  value: string;
  note?: string;
  currencyLabel?: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
};

export default function CreateContractFinanceDurationSelect({
  label,
  options,
  value,
  note,
  currencyLabel,
  disabled = false,
  invalid = false,
  onChange,
}: CreateContractFinanceDurationSelectProps) {
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
          const hasFee = Boolean(option.fee);

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl border px-3.5 py-2.5 text-center transition-colors",
                selected
                  ? "border-brand bg-brand text-white"
                  : invalid
                    ? "border-[#e57373] bg-brand-background text-brand"
                    : "border-[#e8e8e8] bg-brand-background text-[#555555] hover:border-brand/30",
                disabled && "pointer-events-none opacity-60",
              )}
            >
              <span className="text-xs font-bold leading-4 sm:text-sm">
                {option.title}
              </span>

              {hasFee ? (
                <span
                  className={cn(
                    "text-[11px] font-bold tabular-nums leading-3.5",
                    selected ? "text-white/95" : "text-brand-secondary",
                  )}
                >
                  {option.fee}
                  {currencyLabel ? ` ${currencyLabel}` : ""}
                </span>
              ) : null}

              {hasFee && option.feeLabel ? (
                <span
                  className={cn(
                    "text-[9px] leading-3",
                    selected ? "text-white/75" : "text-[#9a9a9a]",
                  )}
                >
                  {option.feeLabel}
                </span>
              ) : null}
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
