"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { LoginFormValues } from "@/features/auth/schemas/login-schema";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Controller, type Control, type FieldPath } from "react-hook-form";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";

type LoginPasswordFieldProps = {
  control: Control<LoginFormValues>;
  label: string;
  placeholder: string;
  toggleVisibilityLabel: string;
};

export default function LoginPasswordField({
  control,
  label,
  placeholder,
  toggleVisibilityLabel,
}: LoginPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldName: FieldPath<LoginFormValues> = "password";

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
              src="/icons/lock.svg"
              size={16}
              className="pointer-events-none absolute inset-s-4 top-1/2  -translate-y-1/2 text-black"
              aria-hidden="true"
            />
            <Input
              {...field}
              id={fieldName}
              type={visible ? "text" : "password"}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete="current-password"
              className={cn(
                "auth-password-input h-14 rounded-full border-[#d6d6d6] bg-[#f7f7f7] pe-12 ps-12 text-base placeholder:text-[#9ca3af] focus-visible:border-[#bdbdbd] focus-visible:ring-[3px] focus-visible:ring-brand/12 md:text-sm",
                fieldState.invalid &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              )}
            />
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              aria-label={toggleVisibilityLabel}
              className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] transition-colors hover:text-foreground"
            >
              {visible ? (
                <RxEyeOpen  className="size-5" aria-hidden="true" />
              ) : (
                <RxEyeClosed  className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
