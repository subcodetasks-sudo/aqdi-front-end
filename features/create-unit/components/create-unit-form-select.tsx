"use client";

import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateUnitFieldLabel from "@/features/create-unit/components/create-unit-field-label";
import {
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateUnitFormSelectProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
};

export default function CreateUnitFormSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  required = true,
  invalid = false,
  errorMessage,
}: CreateUnitFormSelectProps) {
  const showInvalid = invalid || Boolean(errorMessage);
  const chrome = resolveFieldChromeState({ invalid: showInvalid });
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;

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
    <div>
      {required ? (
        <CreateUnitFieldLabel label={label} invalid={showInvalid} />
      ) : (
        <label
          className={cn(
            "mb-2 block text-sm font-semibold",
            showInvalid ? "text-[#c62828]" : "text-brand",
          )}
        >
          {label}
        </label>
      )}

      <div
        ref={containerRef}
        aria-invalid={showInvalid}
        data-field-invalid={showInvalid ? "true" : undefined}
        className={cn(
          "flex h-14 w-full items-center gap-2 rounded-2xl border px-3",
          fieldChromeSurfaceClass(chrome),
        )}
      >
        <div
          className="flex min-w-0 flex-1 items-center"
          onClick={openSelect}
        >
          {value ? (
            <span className="truncate text-sm font-semibold text-[#333333]">
              {selectedLabel}
            </span>
          ) : (
            <button
              type="button"
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
          <SelectTrigger
            aria-label={label}
            className={cn(
              "inline-flex size-8! shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0! text-brand shadow-none focus-visible:ring-0 [&>svg:last-child]:hidden",
            )}
          >
            <ChevronDown className="size-4 text-brand" aria-hidden="true" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            align="end"
            side="bottom"
            sideOffset={6}
            avoidCollisions={false}
            className="max-h-48 rounded-2xl"
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

      {errorMessage ? (
        <p className="mt-1.5 text-xs font-medium text-[#c62828]">{errorMessage}</p>
      ) : null}
    </div>
  );
}
