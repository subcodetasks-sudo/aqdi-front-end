"use client";

import { FlagImage } from "react-international-phone";

import { Field, FieldLabel } from "@/components/ui/field";
import { formatPhoneDisplay } from "@/features/auth/utils/format-phone-display";
import { cn } from "@/lib/utils";
type ProfilePhoneFieldProps = {
  label: string;
  value: string;
};

const profileFieldClassName =
  "auth-password-input h-14 rounded-lg border-[#d6d6d6] bg-white text-base md:text-sm";

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
        className={cn(
          profileFieldClassName,
          "flex items-center overflow-hidden opacity-80",
        )}
      >
        <div className="flex h-full shrink-0 items-center border-e border-[#d6d6d6] px-4">
          <FlagImage iso2="sa" size="24px" aria-hidden="true" />
        </div>        <span className="flex-1 px-4 font-medium text-foreground">
          {displayPhone}
        </span>
      </div>
    </Field>
  );
}
