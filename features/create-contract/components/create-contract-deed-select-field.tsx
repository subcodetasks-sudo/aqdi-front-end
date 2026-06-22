"use client";

import { ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";

type CreateContractDeedSelectFieldProps<T extends string> = {
  label: string;
  placeholder: string;
  options: Record<T, string>;
  optionIds: readonly T[];
  value: T | "";
  onChange: (value: T | "") => void;
};

export default function CreateContractDeedSelectField<T extends string>({
  label,
  placeholder,
  options,
  optionIds,
  value,
  onChange,
}: CreateContractDeedSelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);

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

  function handleValueChange(nextValue: string) {
    onChange(nextValue as T);
    setOpen(false);
  }

  return (
    <div>
      <CreateContractFieldLabel label={label} />

      <div
        ref={containerRef}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <div className="flex min-w-0 flex-1 items-center px-2">
          {value ? (
            <span className="truncate text-sm font-semibold text-[#333333]">
              {options[value]}
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
          onValueChange={handleValueChange}
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
            {optionIds.map((optionId) => (
              <SelectItem key={optionId} value={optionId} className="text-base!">
                {options[optionId]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
