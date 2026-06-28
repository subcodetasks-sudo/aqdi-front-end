"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";

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
}: CreatePropertyIconInputFieldProps) {
  const inputId = useId();

  return (
    <div>
      <CreatePropertyFieldLabel label={label} />

      <div
        dir={dir}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center text-brand-secondary">
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
          className="h-auto border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      {errorMessage ? (
        <p className="mt-1.5 text-xs font-medium text-[#c62828]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
