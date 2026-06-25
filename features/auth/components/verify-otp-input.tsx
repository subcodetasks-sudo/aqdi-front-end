"use client";

import { Controller, type Control } from "react-hook-form";

import {
  InputOTP,
  InputOTPGroup,
} from "@/components/ui/input-otp";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { VerifyOtpFormValues } from "@/features/auth/schemas/verify-otp-schema";
import VerifyOtpSlot from "@/features/auth/components/verify-otp-slot";
import { cn } from "@/lib/utils";

type VerifyOtpInputProps = {
  control: Control<VerifyOtpFormValues>;
  label: string;
};

export default function VerifyOtpInput({ control, label }: VerifyOtpInputProps) {
  return (
    <Controller
      name="otp"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="otp">
            {label}
            <span className="text-destructive">*</span>
          </FieldLabel>

          <div dir="ltr" className="w-full">
            <InputOTP
              dir="ltr"
              id="otp"
              maxLength={4}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              containerClassName="justify-center"
              className={cn(fieldState.invalid && "aria-invalid")}
            >
              <InputOTPGroup
                dir="ltr"
                className="gap-2 border-0 shadow-none ring-0"
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <VerifyOtpSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {fieldState.invalid ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
}
