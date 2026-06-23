"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateUnitFieldLabel from "@/features/create-unit/components/create-unit-field-label";

type CreateUnitAreaFieldProps = {
  label: string;
  placeholder: string;
  suffix: string;
  value: string;
  onChange: (value: string) => void;
};

export default function CreateUnitAreaField({
  label,
  placeholder,
  suffix,
  value,
  onChange,
}: CreateUnitAreaFieldProps) {
  const inputId = useId();

  return (
    <div>
      <CreateUnitFieldLabel label={label} />

      <div className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-4">
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
          className="h-auto border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
        />

        <span className="shrink-0 text-sm font-semibold text-brand-secondary">
          {suffix}
        </span>
      </div>
    </div>
  );
}
