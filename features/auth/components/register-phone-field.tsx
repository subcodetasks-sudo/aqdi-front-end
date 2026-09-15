"use client";

import { Controller, type Control, type FieldPath } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { RegisterFormValues } from "@/features/auth/schemas/register-schema";
import { cn } from "@/lib/utils";

type RegisterPhoneFieldProps = {
  control: Control<RegisterFormValues>;
  label: string;
  placeholder: string;
};

export default function RegisterPhoneField({
  control,
  label,
  placeholder,
}: RegisterPhoneFieldProps) {
  const fieldName: FieldPath<RegisterFormValues> = "phone";

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
