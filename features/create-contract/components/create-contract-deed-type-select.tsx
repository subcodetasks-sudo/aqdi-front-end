"use client";

import { Building2, ChevronLeft, X } from "lucide-react";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  DEED_TYPES,
  type DeedTypeId,
} from "@/features/create-contract/types/deed-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractDeedTypeSelectProps = {
  labels: CreateContractLabels["deed"]["deedType"];
  value: DeedTypeId | "";
  onChange: (value: DeedTypeId | "") => void;
};

export default function CreateContractDeedTypeSelect({
  labels,
  value,
  onChange,
}: CreateContractDeedTypeSelectProps) {
  const [selectKey, setSelectKey] = useState(0);
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

  function handleClear() {
    onChange("");
    setOpen(false);
    setSelectKey((currentKey) => currentKey + 1);
  }

  function handleValueChange(nextValue: string) {
    onChange(nextValue as DeedTypeId);
    setOpen(false);
  }

  return (
    <div>
      <CreateContractFieldLabel label={labels.label} />

      <div
        ref={containerRef}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <Building2 className="size-5 shrink-0 text-brand-secondary" />

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <div className="flex min-w-0 flex-1 items-center px-1">
          {value ? (
            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-linear-to-r from-brand-secondary via-brand to-brand px-3 py-1.5 text-sm font-semibold text-white">
              <span className="truncate">{labels.types[value]}</span>
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center"
                aria-label={labels.clearSelection}
                onClick={handleClear}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="w-full text-start text-sm text-[#bdbdbd]"
              onClick={openSelect}
            >
              {labels.placeholder}
            </button>
          )}
        </div>

        <Select
          key={selectKey}
          open={open}
          onOpenChange={handleOpenChange}
          value={value || undefined}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="inline-flex size-9!  shrink-0 items-center justify-center rounded-full border-0 bg-brand-secondary p-0! text-white shadow-none focus-visible:ring-brand-secondary/20 [&>svg:last-child]:hidden">
            <ChevronLeft className="size-5 -rotate-90 text-white!" aria-hidden="true" />
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
            {DEED_TYPES.map((deedType) => (
              <SelectItem
                key={deedType}
                value={deedType}
                className="text-base!"
              >
                {labels.types[deedType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
