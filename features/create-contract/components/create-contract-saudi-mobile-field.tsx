"use client";

import { Smartphone } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  SAUDI_MOBILE_LENGTH,
  toSaudiMobileInputValue,
} from "@/lib/validation/format-saudi-mobile-for-form";
import {
  fieldChromeIconClass,
  fieldChromeNestedInputClass,
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractSaudiMobileFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  invalid?: boolean;
  valid?: boolean;
};

export default function CreateContractSaudiMobileField({
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
  invalid = false,
  valid = false,
}: CreateContractSaudiMobileFieldProps) {
  const inputId = useId();
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
          "flex h-10 w-full items-center gap-2 rounded-2xl border px-2",
          fieldChromeSurfaceClass(chrome),
        )}
      >
        <span
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center",
            fieldChromeIconClass(chrome),
          )}
        >
          <Smartphone className="size-5" aria-hidden="true" />
        </span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <Input
          id={inputId}
          type="tel"
          dir="ltr"
          inputMode="tel"
          maxLength={SAUDI_MOBILE_LENGTH}
          value={value}
          onChange={(event) => {
            onChange(toSaudiMobileInputValue(event.target.value));
          }}
          placeholder={placeholder}
          aria-invalid={showInvalid}
          className={cn("h-auto px-1 text-sm", fieldChromeNestedInputClass)}
        />
      </div>

      {errorMessage ? (
        <p className="mt-1.5 text-xs font-medium text-[#c62828]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
