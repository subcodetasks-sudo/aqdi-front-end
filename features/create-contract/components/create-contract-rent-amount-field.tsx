"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractRentAmountFieldProps = {
  label: string;
  placeholder: string;
  currency?: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  valid?: boolean;
};

function formatRentAmount(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return Number(digits).toLocaleString("en-US");
}

export default function CreateContractRentAmountField({
  label,
  placeholder,
  currency = "ريال",
  value,
  onChange,
  invalid = false,
  valid = false,
}: CreateContractRentAmountFieldProps) {
  const inputId = useId();
  const chrome = resolveFieldChromeState({ invalid, valid });

  return (
    <div>
      <CreateContractFieldLabel label={label} invalid={invalid} />

      <div
        dir="ltr"
        className={cn(
          "flex h-14 w-full items-center gap-2 rounded-2xl border px-4",
          fieldChromeSurfaceClass(chrome, {
            defaultBgClassName: "bg-white",
          }),
        )}
      >
        <span className="shrink-0 text-sm font-bold text-brand">{currency}</span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <Input
          id={inputId}
          type="text"
          inputMode="numeric"
          dir="ltr"
          value={formatRentAmount(value)}
          onChange={(event) => {
            onChange(event.target.value.replace(/\D/g, ""));
          }}
          placeholder={placeholder}
          aria-invalid={invalid}
          className="h-auto border-0 bg-transparent px-1 text-sm font-semibold shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
