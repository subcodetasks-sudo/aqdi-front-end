"use client";

import { Controller, type Control, type FieldPath } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { ForgotPasswordFormValues } from "@/features/auth/schemas/forgot-password-schema";
import { cn } from "@/lib/utils";

type ForgotPasswordPhoneFieldProps = {
  control: Control<ForgotPasswordFormValues>;
  label: string;
  placeholder: string;
};

export default function ForgotPasswordPhoneField({
  control,
  label,
  placeholder,
}: ForgotPasswordPhoneFieldProps) {
  const fieldName: FieldPath<ForgotPasswordFormValues> = "phone";

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
          <div dir="ltr">
            <PhoneInput
              defaultCountry="sa"
              value={field.value}
              onChange={(phone) => field.onChange(phone)}
              onBlur={field.onBlur}
              placeholder={placeholder}
              className={cn(
                "auth-phone-input w-full",
                fieldState.invalid && "auth-phone-input--invalid"
              )}
              inputClassName="w-full bg-transparent text-base md:text-sm"
              inputProps={{
                id: fieldName,
                name: field.name,
                "aria-invalid": fieldState.invalid,
                autoComplete: "tel",
                dir: "ltr",
              }}
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
