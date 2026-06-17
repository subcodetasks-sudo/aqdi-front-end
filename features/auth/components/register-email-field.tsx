"use client";

import { Mail } from "lucide-react";
import { Controller, type Control, type FieldPath } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { RegisterFormValues } from "@/features/auth/schemas/register-schema";
import { cn } from "@/lib/utils";

type RegisterEmailFieldProps = {
  control: Control<RegisterFormValues>;
  label: string;
  placeholder: string;
};

export default function RegisterEmailField({
  control,
  label,
  placeholder,
}: RegisterEmailFieldProps) {
  const fieldName: FieldPath<RegisterFormValues> = "email";

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldName}>
            {label}
            <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute inset-s-4 top-1/2 size-4 -translate-y-1/2 text-black"
              aria-hidden="true"
            />
            <Input
              {...field}
              id={fieldName}
              type="email"
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete="email"
              dir="ltr"
              className={cn(
                "auth-password-input h-14 rounded-full border-[#d6d6d6] bg-[#f7f7f7] pe-4 ps-12 text-start text-base placeholder:text-[#9ca3af] focus-visible:border-[#bdbdbd] focus-visible:ring-[3px] focus-visible:ring-brand/12 md:text-sm",
                fieldState.invalid &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
              )}
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
