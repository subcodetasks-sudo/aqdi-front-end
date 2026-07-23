"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  getSaudiMobileSubscriber,
  SAUDI_MOBILE_LENGTH,
  SAUDI_MOBILE_PREFIX,
  toSaudiMobileFromSubscriberInput,
} from "@/lib/validation/format-saudi-mobile-for-form";
import {
  fieldChromeIconClass,
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractSaudiMobileFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  errorMessage?: string;
  invalid?: boolean;
  valid?: boolean;
};

export default function CreateContractSaudiMobileField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  errorMessage,
  invalid = false,
  valid = false,
}: CreateContractSaudiMobileFieldProps) {
  const inputId = useId();
  const subscriber = getSaudiMobileSubscriber(value);
  const showInvalid = invalid || Boolean(errorMessage);
  const chrome = resolveFieldChromeState({
    invalid: showInvalid,
    valid,
  });

  return (
    <div>
      <CreateContractFieldLabel label={label} invalid={showInvalid} />

      <div
        dir="ltr"
        className={cn(
          "flex h-14 w-full items-center gap-2 rounded-2xl border px-2",
          fieldChromeSurfaceClass(chrome),
        )}
      >
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center",
            fieldChromeIconClass(chrome),
          )}
        >
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
          maxLength={SAUDI_MOBILE_LENGTH}
          value={subscriber}
          onChange={(event) => {
            onChange(toSaudiMobileFromSubscriberInput(event.target.value));
          }}
          placeholder={placeholder}
          aria-invalid={showInvalid}
          className="h-auto border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      {errorMessage ? (
        <p className="mt-1.5 text-xs font-medium text-[#c62828]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
