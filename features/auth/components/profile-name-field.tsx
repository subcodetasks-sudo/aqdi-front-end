"use client";

import { Controller, type Control, type FieldPath } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProfileFormValues } from "@/features/auth/schemas/profile-schema";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type ProfileNameFieldProps = {
  control: Control<ProfileFormValues>;
  label: string;
  placeholder: string;
};

export default function ProfileNameField({
  control,
  label,
  placeholder,
}: ProfileNameFieldProps) {
  const fieldName: FieldPath<ProfileFormValues> = "fullName";

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
            <CustomIcon
              src="/icons/user.svg"
              size={16}
              className="pointer-events-none absolute inset-s-4 top-1/2 -translate-y-1/2 text-black"
              aria-hidden="true"
            />
            <Input
              {...field}
              id={fieldName}
              type="text"
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete="name"
              className={cn(
                "auth-password-input h-14 rounded-lg border-[#d6d6d6] bg-white pe-4 ps-12 text-base placeholder:text-[#9ca3af] focus-visible:border-[#bdbdbd] focus-visible:ring-[3px] focus-visible:ring-brand/12 md:text-sm",
                fieldState.invalid &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              )}
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
