"use client";

import { Building2 } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import CustomIcon from "@/features/shared/components/custom-icon";
import {
  fieldChromeIconClass,
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
          "flex h-14 w-full items-center gap-2 rounded-2xl border px-2",
          fieldChromeSurfaceClass(chrome, {
            defaultBgClassName: "bg-white",
          }),
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
          className="h-auto border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="space-y-1">
        <p className="flex items-start gap-1.5 text-sm text-[#333333]">
          <CustomIcon
            src="/icons/like.svg"
            size={18}
            className="mt-0.5 shrink-0 text-red-400"
          />
          <span>{hint}</span>
        </p>
        <p className="text-xs text-[#bdbdbd]">{example}</p>
      </div>
    </div>
  );
}
