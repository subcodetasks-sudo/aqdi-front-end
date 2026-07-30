"use client";

import { useId } from "react";

import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import { Input } from "@/components/ui/input";
import { fieldChromeNestedInputClass } from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractRentedUnitAreaFieldProps = {
  label: string;
  placeholder: string;
  suffix: string;
  value: string;
  onChange: (value: string) => void;
};

export default function CreateContractRentedUnitAreaField({
  label,
  placeholder,
  suffix,
  value,
  onChange,
}: CreateContractRentedUnitAreaFieldProps) {
  const inputId = useId();

  return (
    <div>
      <CreateContractFieldLabel label={label} />

      <div className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-[#FBFBFA] px-4">
        <Input
          id={inputId}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value.replace(/[^\d.]/g, "");
            onChange(nextValue);
          }}
          placeholder={placeholder}
          className={cn("h-auto px-0 text-sm", fieldChromeNestedInputClass)}
        />

        <span className="shrink-0 text-sm font-semibold text-brand-secondary">
          {suffix}
        </span>
      </div>
    </div>
  );
}
