"use client";

import { Building2 } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import {
  fieldChromeIconClass,
  fieldChromeNestedInputClass,
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreatePropertyNameFieldProps = {
  label: string;
  placeholder: string;
  hint: string;
  example: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  valid?: boolean;
};

export default function CreatePropertyNameField({
  label,
  placeholder,
  hint,
  example,
  value,
  onChange,
  invalid = false,
  valid = false,
}: CreatePropertyNameFieldProps) {
  const inputId = useId();
  const chrome = resolveFieldChromeState({ invalid, valid });

  return (
    <div className="space-y-3">
      <CreatePropertyFieldLabel label={label} invalid={invalid} />

      <div
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-2xl border px-2",
          fieldChromeSurfaceClass(chrome),
        )}
      >
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center",
            fieldChromeIconClass(chrome),
          )}
        >
          <Building2 className="size-5" aria-hidden="true" />
        </span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <Input
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={invalid}
          className={cn("h-auto px-2 text-sm", fieldChromeNestedInputClass)}
        />
      </div>

      <div className="space-y-1 text-sm leading-relaxed text-brand">
        <p>
          <span className="me-1 inline-block" aria-hidden="true">
            ✋
          </span>
          <span>{hint}</span>
        </p>
        {example ? <p>{example}</p> : null}
      </div>
    </div>
  );
}
