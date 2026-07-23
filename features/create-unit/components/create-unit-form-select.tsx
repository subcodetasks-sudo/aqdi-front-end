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
import { cn } from "@/lib/utils";

type CreateUnitFormSelectProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export default function CreateUnitFormSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  required = true,
}: CreateUnitFormSelectProps) {
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
        <CreateUnitFieldLabel label={label} />
      ) : (
        <label className="mb-2 block text-sm font-semibold text-brand">
          {label}
        </label>
      )}

      <div
        ref={containerRef}
        className="flex h-14 w-full items-center gap-2 rounded-2xl border border-[#e8e8e8] bg-brand-background px-3"
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
