"use client";

import { Controller, type Control, type FieldPath } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { LoginFormValues } from "@/features/auth/schemas/login-schema";
import { cn } from "@/lib/utils";

type LoginPhoneFieldProps = {
  control: Control<LoginFormValues>;
  label: string;
  placeholder: string;
};

export default function LoginPhoneField({
  control,
  label,
  placeholder,
}: LoginPhoneFieldProps) {
  const fieldName: FieldPath<LoginFormValues> = "phone";

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
            hideDropdown
            disableCountryGuess
            forceDialCode
            value={field.value}
            onChange={(phone) => field.onChange(phone)}
            onBlur={field.onBlur}
            placeholder={placeholder}
            className={cn(
              "auth-phone-input w-full",
              fieldState.invalid && "auth-phone-input--invalid",
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
