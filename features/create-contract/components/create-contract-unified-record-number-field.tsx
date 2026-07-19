"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  getUnifiedRecordNumberSubscriber,
  toUnifiedRecordNumberInputValue,
  UNIFIED_RECORD_NUMBER_LENGTH,
  UNIFIED_RECORD_NUMBER_PREFIX,
  UNIFIED_RECORD_NUMBER_SUBSCRIBER_LENGTH,
} from "@/lib/validation/format-unified-record-number-for-form";

type CreateContractUnifiedRecordNumberFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  hint?: string;
  errorMessage?: string;
};

export default function CreateContractUnifiedRecordNumberField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  hint,
  errorMessage,
}: CreateContractUnifiedRecordNumberFieldProps) {
  const inputId = useId();
  const subscriber = getUnifiedRecordNumberSubscriber(value);
  const digitCount = value.replace(/\D/g, "").length;

  return (
    <div>
      <CreateContractFieldLabel label={label} />

      <div
        dir="ltr"
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center text-brand-secondary">
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <span className="shrink-0 ps-1 text-sm font-semibold text-foreground">
          {UNIFIED_RECORD_NUMBER_PREFIX}
        </span>

        <Input
          id={inputId}
          type="tel"
          dir="ltr"
          inputMode="numeric"
          maxLength={UNIFIED_RECORD_NUMBER_SUBSCRIBER_LENGTH}
          value={subscriber}
          onChange={(event) => {
            const nextDigits = event.target.value.replace(/\D/g, "");
            onChange(
              toUnifiedRecordNumberInputValue(
                `${UNIFIED_RECORD_NUMBER_PREFIX}${nextDigits}`,
              ),
            );
          }}
          placeholder={placeholder}
          className="h-auto min-w-0 flex-1 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
        />

        <span className="shrink-0 pe-2 text-xs font-semibold text-[#9a9a9a]">
          {digitCount}/{UNIFIED_RECORD_NUMBER_LENGTH}
        </span>
      </div>

      {hint ? (
        <p className="mt-1.5 text-xs leading-5 text-[#9a9a9a]">{hint}</p>
      ) : null}

      {errorMessage ? (
        <p className="mt-1.5 text-xs font-medium text-[#c62828]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
