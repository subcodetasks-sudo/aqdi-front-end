"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateContractFieldError from "@/features/create-contract/components/create-contract-field-error";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractFormSelectProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hideLabel?: boolean;
  variant?: "default" | "compact";
  invalid?: boolean;
  valid?: boolean;
};

export default function CreateContractFormSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  required = true,
  hideLabel = false,
  variant = "default",
  invalid = false,
  valid = false,
}: CreateContractFormSelectProps) {
  const t = useTranslations("createContract");
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;
  const isCompact = variant === "compact";
  const chrome = resolveFieldChromeState({ invalid, valid });

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && containerRef.current) {
      setContentWidth(containerRef.current.offsetWidth);
    }

    setOpen(nextOpen);
  }

  function openSelect() {
    if (containerRef.current) {
      setContentWidth(containerRef.current.offsetWidth);
    }

    setOpen(true);
  }

  return (
    <div className="min-w-0" data-field-invalid={invalid ? "true" : undefined}>
      {!hideLabel ? (
        required ? (
          <CreateContractFieldLabel label={label} invalid={invalid} />
        ) : (
          <label
            className={cn(
              "mb-2 block text-sm font-semibold",
              invalid ? "text-[#c62828]" : "text-black dark:text-white",
            )}
          >
            {label}
          </label>
        )
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          "flex w-full items-center gap-2 rounded-2xl border px-3",
          fieldChromeSurfaceClass(chrome),
          isCompact ? "h-12" : "h-14",
        )}
      >
        <div
          className="flex min-w-0 flex-1 items-center"
          onClick={openSelect}
        >
          {value ? (
            <span
              className={cn(
                "truncate font-semibold text-[#333333] dark:text-white",
                isCompact ? "text-xs sm:text-sm" : "text-sm",
              )}
            >
              {selectedLabel}
            </span>
          ) : (
            <button
              type="button"
              aria-label={label}
              className={cn(
                "w-full text-start text-[#bdbdbd] dark:text-[#6b7d78]",
                isCompact ? "text-xs sm:text-sm" : "text-sm",
              )}
              onClick={openSelect}
            >
              {placeholder}
            </button>
          )}
        </div>

        <Select
          open={open}
          onOpenChange={handleOpenChange}
          value={value || undefined}
          onValueChange={(nextValue) => {
            onChange(nextValue);
            setOpen(false);
          }}
        >
          <SelectTrigger
            aria-label={label}
            className="inline-flex size-7! shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0! text-[#333333] shadow-none focus-visible:ring-0 dark:text-white [&>svg:last-child]:hidden"
          >
            <ChevronDown className="size-4 text-[#333333] dark:text-white" aria-hidden="true" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            align="end"
            side="bottom"
            sideOffset={6}
            avoidCollisions={false}
            className="max-h-[min(20rem,var(--radix-select-content-available-height))] rounded-2xl border border-[#2f403b] bg-[#1a2421] text-white"
            style={{
              width: contentWidth,
              minWidth: contentWidth,
            }}
          >
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-base!"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {invalid ? <CreateContractFieldError message={t("fieldRequired")} /> : null}
    </div>
  );
}
