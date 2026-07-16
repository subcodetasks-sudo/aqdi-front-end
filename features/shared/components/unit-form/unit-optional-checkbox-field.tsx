"use client";

import { Checkbox } from "@/components/ui/checkbox";

type UnitOptionalCheckboxFieldProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: React.ReactNode;
};

export default function UnitOptionalCheckboxField({
  label,
  checked,
  onCheckedChange,
  children,
}: UnitOptionalCheckboxFieldProps) {
  return (
    <div dir="rtl" className="space-y-3">
      <label className="flex cursor-pointer items-center gap-2">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          className="size-5 rounded-full border-brand-secondary data-checked:border-brand-secondary data-checked:bg-brand-secondary"
        />
        <span className="text-sm font-semibold text-brand">{label}</span>
      </label>

      {checked && children ? <div>{children}</div> : null}
    </div>
  );
}
