"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import {
  fieldChromeIconClass,
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreatePropertyIconInputFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  type?: "text" | "tel";
  dir?: "ltr" | "rtl";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  errorMessage?: string;
  invalid?: boolean;
  valid?: boolean;
};

export default function CreatePropertyIconInputField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = "text",
  dir,
  inputMode,
  maxLength,
  errorMessage,
  invalid = false,
  valid = false,
}: CreatePropertyIconInputFieldProps) {
  const inputId = useId();
  const showInvalid = invalid || Boolean(errorMessage);
  const chrome = resolveFieldChromeState({
    invalid: showInvalid,
    valid,
  });

  return (
    <div>
      <CreatePropertyFieldLabel label={label} invalid={showInvalid} />

      <div
        dir={dir}
        className={cn(
          "flex h-14 w-full items-center gap-2 rounded-2xl border px-2",
          fieldChromeSurfaceClass(chrome),
        )}
      >
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center",
            fieldChromeIconClass(chrome),
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <Input
          id={inputId}
          type={type}
          dir={dir}
          inputMode={inputMode}
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={showInvalid}
          className="h-auto border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      {errorMessage ? (
        <p className="mt-1.5 text-xs font-medium text-[#c62828]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
