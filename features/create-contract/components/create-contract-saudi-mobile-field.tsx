"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  getSaudiMobileSubscriber,
  SAUDI_MOBILE_PREFIX,
  SAUDI_MOBILE_SUBSCRIBER_LENGTH,
  toSaudiMobileInputValue,
} from "@/lib/validation/format-saudi-mobile-for-form";

type CreateContractSaudiMobileFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  errorMessage?: string;
};

export default function CreateContractSaudiMobileField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  errorMessage,
}: CreateContractSaudiMobileFieldProps) {
  const inputId = useId();
  const subscriber = getSaudiMobileSubscriber(value);

  return (
    <div>
      <CreateContractFieldLabel label={label} />

      <div
        dir="ltr"
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center text-brand-secondary">
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <span className="shrink-0 ps-1 text-sm font-semibold text-foreground">
          {SAUDI_MOBILE_PREFIX}
        </span>

        <Input
          id={inputId}
          type="tel"
          dir="ltr"
          inputMode="tel"
          maxLength={SAUDI_MOBILE_SUBSCRIBER_LENGTH}
          value={subscriber}
          onChange={(event) => {
            const nextDigits = event.target.value.replace(/\D/g, "");
            onChange(toSaudiMobileInputValue(`${SAUDI_MOBILE_PREFIX}${nextDigits}`));
          }}
          placeholder={placeholder}
          className="h-auto border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      {errorMessage ? (
        <p className="mt-1.5 text-xs font-medium text-[#c62828]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
