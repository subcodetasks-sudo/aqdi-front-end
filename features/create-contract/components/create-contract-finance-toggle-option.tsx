"use client";

import { Info, Pencil } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type CreateContractFinanceToggleOptionProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  actionLabel: string;
  actionVariant: "edit" | "add";
  onAction?: () => void;
};

export default function CreateContractFinanceToggleOption({
  label,
  checked,
  onCheckedChange,
  actionLabel,
  actionVariant,
  onAction,
}: CreateContractFinanceToggleOptionProps) {
  return (
    <div className="flex items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-3">
        <Switch
          dir="ltr"
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="h-6 w-11 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9]"
        />
        <span className="flex items-center gap-1.5 text-sm font-semibold text-brand">
          {label}
          <Info className="size-4 text-[#bdbdbd]" aria-hidden="true" />
        </span>
      </label>
      <button
        type="button"
        onClick={onAction}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors",
          actionVariant === "edit"
            ? "text-brand-secondary hover:text-brand"
            : "text-[#bdbdbd] hover:text-[#999999]",
        )}
      >
        {actionVariant === "edit" ? (
          <Pencil className="size-4" aria-hidden="true" />
        ) : null}
        {actionLabel}
      </button>


    </div>
  );
}
