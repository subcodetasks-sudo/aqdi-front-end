"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import CustomIcon from "@/features/shared/components/custom-icon";

type CreateContractRentAmountFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
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
  value,
  onChange,
}: CreateContractRentAmountFieldProps) {
  const inputId = useId();

  return (
    <div>
      <CreateContractFieldLabel label={label} />

      <div className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2">
        <span className="inline-flex size-10 shrink-0 items-center justify-center text-brand-secondary">
          <CustomIcon src="/icons/ryal.svg" size={20} />
        </span>

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
          className="h-auto border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
