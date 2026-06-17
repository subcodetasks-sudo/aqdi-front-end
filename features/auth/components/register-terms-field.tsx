"use client";

import Link from "next/link";
import { Controller, type Control } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { RegisterFormValues } from "@/features/auth/schemas/register-schema";

type RegisterTermsFieldProps = {
  control: Control<RegisterFormValues>;
  prefix: string;
  termsLink: string;
  andLabel: string;
  privacyLink: string;
  termsHref: string;
  privacyHref: string;
};

export default function RegisterTermsField({
  control,
  prefix,
  termsLink,
  andLabel,
  privacyLink,
  termsHref,
  privacyHref,
}: RegisterTermsFieldProps) {
  return (
    <Controller
      name="acceptTerms"
      control={control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid}
          className="items-start gap-3"
        >
          <Checkbox
            id="acceptTerms"
            checked={field.value === true}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            aria-invalid={fieldState.invalid}
            className="mt-0.5 data-[state=checked]:bg-brand"
          />
          <div className="space-y-1">
            <FieldLabel htmlFor="acceptTerms" className="font-normal leading-relaxed">
              {prefix}{" "}
              <Link
                href={termsHref}
                className="font-semibold text-brand transition-colors hover:text-brand/80"
              >
                {termsLink}
              </Link>{" "}
              {andLabel}{" "}
              <Link
                href={privacyHref}
                className="font-semibold text-brand transition-colors hover:text-brand/80"
              >
                {privacyLink}
              </Link>
            </FieldLabel>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        </Field>
      )}
    />
  );
}
