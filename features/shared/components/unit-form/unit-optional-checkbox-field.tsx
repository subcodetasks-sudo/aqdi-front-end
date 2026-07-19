"use client";

import type { ReactNode } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type UnitOptionalCheckboxFieldProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
  icon?: ReactNode;
  warning?: string;
  disabled?: boolean;
};

export default function UnitOptionalCheckboxField({
  label,
  checked,
  onCheckedChange,
  children,
  icon,
  warning,
  disabled = false,
}: UnitOptionalCheckboxFieldProps) {
  return (
    <div dir="rtl" className="space-y-3">
      <label
        className={cn(
          "flex items-center justify-between gap-3 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3",
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        )}
      >
        <span className="min-w-0 space-y-1 text-start">
          <span className="flex items-center gap-2 text-sm font-semibold text-brand">
            {icon}
            {label}
          </span>
          {warning ? (
            <span className="block text-xs font-medium text-red-500">
              {warning}
            </span>
          ) : null}
        </span>

        <Switch
          dir="ltr"
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          className="h-6 w-11 shrink-0 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9]"
        />
      </label>

      {checked && children ? <div>{children}</div> : null}
    </div>
  );
}
