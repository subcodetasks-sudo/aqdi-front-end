"use client";

import { Info } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type CreateContractRentedUnitCheckboxOptionProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: React.ReactNode;
};

export default function CreateContractRentedUnitCheckboxOption({
  label,
  checked,
  onCheckedChange,
  children,
}: CreateContractRentedUnitCheckboxOptionProps) {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          className="size-5 rounded-full border-brand-secondary data-checked:border-brand-secondary data-checked:bg-brand-secondary"
        />
        <span className="flex items-center gap-1.5 text-sm font-semibold text-brand">
          {label}
          <Info className="size-4 text-[#bdbdbd]" aria-hidden="true" />
        </span>
      </label>

      {checked && children ? (
        <div className="ps-8">{children}</div>
      ) : null}
    </div>
  );
}

type FurnishingTypeToggleProps = {
  label: string;
  newLabel: string;
  usedLabel: string;
  value: "new" | "used" | "";
  onChange: (value: "new" | "used") => void;
};

export function CreateContractFurnishingTypeToggle({
  label,
  newLabel,
  usedLabel,
  value,
  onChange,
}: FurnishingTypeToggleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label className="text-sm font-semibold text-brand">
        {label}
        <span className="text-red-500"> *</span>
      </label>

      <div className="flex items-center rounded-full border border-[#e8e8e8] bg-brand-background p-1">
        {(["new", "used"] as const).map((furnishingType) => (
          <button
            key={furnishingType}
            type="button"
            onClick={() => onChange(furnishingType)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              value === furnishingType
                ? "bg-brand text-white"
                : "text-[#7f7f7f] hover:text-[#555555]",
            )}
          >
            {furnishingType === "new" ? newLabel : usedLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
