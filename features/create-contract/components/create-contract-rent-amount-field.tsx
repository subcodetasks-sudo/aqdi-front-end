"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import CreateContractFieldError from "@/features/create-contract/components/create-contract-field-error";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import { numberToArabicWords } from "@/features/create-contract/utils/number-to-arabic-words";
import {
  fieldChromeNestedInputClass,
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractRentAmountFieldProps = {
  label: string;
  placeholder: string;
  currency?: string;
  amountInWordsLabel?: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  valid?: boolean;
};

function formatRentAmount(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return Number(digits).toLocaleString("en-US");
}

export default function CreateContractRentAmountField({
  label,
  placeholder,
  currency = "ريال",
  amountInWordsLabel,
  value,
  onChange,
  invalid = false,
  valid = false,
}: CreateContractRentAmountFieldProps) {
  const t = useTranslations("createContract");
  const inputId = useId();
  const chrome = resolveFieldChromeState({ invalid, valid });
  const numericValue = Number(value.replace(/\D/g, ""));
  const amountInWords =
    amountInWordsLabel && numericValue > 0
      ? amountInWordsLabel.replace(
          "{amount}",
          `${numberToArabicWords(numericValue)} ${currency}`,
        )
      : null;

  return (
    <div>
      <CreateContractFieldLabel label={label} invalid={invalid} />

      <div
        dir="ltr"
        className={cn(
          "flex h-14 w-full items-center gap-2 rounded-2xl border px-4",
          fieldChromeSurfaceClass(chrome),
        )}
      >
        <span className="shrink-0 text-sm font-bold text-brand">{currency}</span>

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <Input
          id={inputId}
          type="text"
          inputMode="numeric"
          dir="ltr"
          value={formatRentAmount(value)}
          onChange={(event) => {
            onChange(event.target.value.replace(/\D/g, ""));
          }}
          placeholder={placeholder}
          aria-invalid={invalid}
          className={cn(
            "h-auto px-1 text-sm font-semibold",
            fieldChromeNestedInputClass,
          )}
        />
      </div>

      {invalid ? <CreateContractFieldError message={t("fieldRequired")} /> : null}

      {amountInWords ? (
        <p className="mt-2 text-xs leading-5 text-[#9a9a9a]">{amountInWords}</p>
      ) : null}
    </div>
  );
}
