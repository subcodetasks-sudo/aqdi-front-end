"use client";

import { FlagImage } from "react-international-phone";

import { Field, FieldLabel } from "@/components/ui/field";
import { formatPhoneDisplay } from "@/features/auth/utils/format-phone-display";

type ProfilePhoneFieldProps = {
  label: string;
  value: string;
};

export default function ProfilePhoneField({
  label,
  value,
}: ProfilePhoneFieldProps) {
  const displayPhone = formatPhoneDisplay(value);

  return (
    <Field>
      <FieldLabel>
        {label}
        <span className="text-destructive">*</span>
      </FieldLabel>
      <div
        dir="ltr"
        aria-readonly="true"
        className="flex h-14 items-center overflow-hidden rounded-lg border border-[#d6d6d6] bg-white opacity-90"
      >
        <div className="flex h-full shrink-0 items-center border-e border-[#d6d6d6] px-4">
          <FlagImage iso2="sa" size="24px" aria-hidden="true" />
        </div>
        <span className="flex-1 px-4 text-base font-medium text-foreground md:text-sm">
          {displayPhone}
        </span>
      </div>
    </Field>
  );
}
