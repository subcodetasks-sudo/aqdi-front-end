"use client";

import { ChevronDown, ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
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
    <div className={cn(isCompact && "min-w-0")}>
      {!hideLabel ? (
        required ? (
          <CreateContractFieldLabel label={label} invalid={invalid} />
        ) : (
          <label
            className={cn(
              "mb-2 block text-sm font-semibold",
              invalid ? "text-[#c62828]" : "text-brand",
            )}
          >
            {label}
          </label>
        )
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          "flex w-full items-center gap-2 border",
          fieldChromeSurfaceClass(chrome, {
            defaultBgClassName: isCompact ? "bg-white" : "bg-brand-background",
          }),
          isCompact
            ? "h-12 rounded-2xl px-3"
            : "h-14 rounded-full px-2",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center",
            !isCompact && "px-2",
          )}
          onClick={openSelect}
        >
          {value ? (
            <span className="truncate text-sm font-semibold text-[#333333]">
              {selectedLabel}
            </span>
          ) : (
            <button
              type="button"
              aria-label={label}
              className="w-full text-start text-sm text-[#bdbdbd]"
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
          {isCompact ? (
            <SelectTrigger
              aria-label={label}
              className="inline-flex size-8! shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0! text-[#9a9a9a] shadow-none focus-visible:ring-0 [&>svg:last-child]:hidden"
            >
              <ChevronDown className="size-4 text-[#9a9a9a]" aria-hidden="true" />
            </SelectTrigger>
          ) : (
            <SelectTrigger className="inline-flex size-9! shrink-0 items-center justify-center rounded-full border-0 bg-brand-secondary p-0! text-white shadow-none focus-visible:ring-brand-secondary/20 [&>svg:last-child]:hidden">
              <ChevronLeft
                className="size-5 -rotate-90 text-white!"
                aria-hidden="true"
              />
            </SelectTrigger>
          )}

          <SelectContent
            position="popper"
            align="end"
            side="bottom"
            className="max-h-72 rounded-2xl"
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
    </div>
  );
}
