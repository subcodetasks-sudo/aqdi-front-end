"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateUnitFieldLabel from "@/features/create-unit/components/create-unit-field-label";
import { fieldChromeNestedInputClass } from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateUnitIconInputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  type?: "text" | "tel";
  dir?: "ltr" | "rtl";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  required?: boolean;
  hideLabel?: boolean;
};

export default function CreateUnitIconInputField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = "text",
  dir,
  inputMode,
  maxLength,
  required = true,
  hideLabel = false,
}: CreateUnitIconInputFieldProps) {
  const inputId = useId();

  return (
    <div>
      {hideLabel ? null : (
        required ? (
          <CreateUnitFieldLabel label={label} />
        ) : (
          <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
            {label}
          </label>
        )
      )}

      <div
        dir={dir}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-[#FBFBFA] px-2 dark:border-[#2f403b] dark:bg-[#0d1614]"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center text-brand-secondary">
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc] dark:bg-[#2f403b]" aria-hidden="true" />

        <Input
          id={inputId}
          type={type}
          dir={dir}
          inputMode={inputMode}
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-auto px-2 text-sm",
            fieldChromeNestedInputClass,
          )}
        />
      </div>
    </div>
  );
}
