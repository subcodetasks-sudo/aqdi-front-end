"use client";

import { Calendar, ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";

type CreateContractFinanceDurationSelectProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function CreateContractFinanceDurationSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: CreateContractFinanceDurationSelectProps) {
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
      <CreateContractFieldLabel label={label} />

      <div
        ref={containerRef}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <div
          className="flex min-w-0 flex-1 items-center gap-2"
          onClick={openSelect}
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center text-brand-secondary">
            <Calendar className="size-5" aria-hidden="true" />
          </span>

          <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

          <div className="flex min-w-0 flex-1 items-center px-2">
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
          <SelectTrigger className="inline-flex size-9! shrink-0 items-center justify-center rounded-full border-0 bg-brand-secondary p-0! text-white shadow-none focus-visible:ring-brand-secondary/20 [&>svg:last-child]:hidden">
            <ChevronLeft
              className="size-5 -rotate-90 text-white!"
              aria-hidden="true"
            />
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
