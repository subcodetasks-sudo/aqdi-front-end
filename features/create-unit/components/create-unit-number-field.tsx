"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateUnitFieldLabel from "@/features/create-unit/components/create-unit-field-label";

type CreateUnitNumberFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function CreateUnitNumberField({
  label,
  placeholder,
  value,
  onChange,
}: CreateUnitNumberFieldProps) {
  const inputId = useId();

  return (
    <div>
      <CreateUnitFieldLabel label={label} />

      <div className="flex h-14 w-full items-center gap-2 rounded-2xl border border-[#e8e8e8] bg-brand-background px-4">
        <span className="shrink-0 text-base font-bold text-brand" aria-hidden="true">
          #
        </span>

        <Input
          id={inputId}
          type="text"
          inputMode="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-auto border-0 bg-transparent px-0 text-sm font-semibold shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
