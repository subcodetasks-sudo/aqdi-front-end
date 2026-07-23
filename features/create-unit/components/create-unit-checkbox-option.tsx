"use client";

import { Info } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type CreateUnitCheckboxOptionProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: React.ReactNode;
};

export default function CreateUnitCheckboxOption({
  label,
  checked,
  onCheckedChange,
  children,
}: CreateUnitCheckboxOptionProps) {
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

      {checked && children ? <div className="ps-8">{children}</div> : null}
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

export function CreateUnitFurnishingTypeToggle({
  label,
  newLabel,
  usedLabel,
  value,
  onChange,
}: FurnishingTypeToggleProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-brand">
        {label}
        <span className="text-red-500"> *</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        {(["new", "used"] as const).map((furnishingType) => {
          const selected = value === furnishingType;

          return (
            <button
              key={furnishingType}
              type="button"
              onClick={() => onChange(furnishingType)}
              className={cn(
                "h-12 rounded-xl text-sm font-bold transition-colors",
                selected
                  ? "bg-brand text-white"
                  : "border border-[#e8e8e8] bg-white text-[#b0b0b0] hover:border-[#d4d4d4] hover:text-[#8a8a8a]",
              )}
            >
              {furnishingType === "new" ? newLabel : usedLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
