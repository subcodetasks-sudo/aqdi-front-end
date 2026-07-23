"use client";

import { Building2, ChevronDown, X } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { useSettingContracts } from "@/features/shared/hooks/use-setting-contracts";
import { resolvePropertySettingContractOptions } from "@/features/shared/utils/resolve-setting-contract-options";
import {
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreatePropertyDeedTypeSelectProps = {
  labels: CreatePropertyLabels["deed"]["deedType"];
  value: PropertyDeedTypeId | "";
  onChange: (value: PropertyDeedTypeId | "") => void;
  invalid?: boolean;
};

export default function CreatePropertyDeedTypeSelect({
  labels,
  value,
  onChange,
  invalid = false,
}: CreatePropertyDeedTypeSelectProps) {
  const [selectKey, setSelectKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: settingContracts } = useSettingContracts();
  const deedTypeOptions = resolvePropertySettingContractOptions(
    settingContracts,
    value,
  );
  const chrome = resolveFieldChromeState({
    invalid,
    valid: value !== "",
  });

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

  function handleClear(event: MouseEvent) {
    event.stopPropagation();
    onChange("");
    setOpen(false);
    setSelectKey((currentKey) => currentKey + 1);
  }

  function handleValueChange(nextValue: string) {
    onChange(nextValue as PropertyDeedTypeId);
    setOpen(false);
  }

  return (
    <div>
      <CreatePropertyFieldLabel label={labels.label} invalid={invalid} />

      <div
        ref={containerRef}
        className={cn(
          "flex h-14 w-full items-center gap-2 rounded-2xl border px-3 transition-colors",
          fieldChromeSurfaceClass(chrome, {
            defaultBgClassName: "bg-white",
          }),
          open && chrome === "default" && "border-brand",
        )}
      >
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-start"
          onClick={openSelect}
        >
          <Building2
            className="size-5 shrink-0 text-brand-secondary"
            aria-hidden="true"
          />
          <span className="h-5 w-px shrink-0 bg-[#e8e8e8]" aria-hidden="true" />

          {value ? (
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm font-semibold text-[#333333]">
                {labels.types[value]}
              </span>
              <span
                role="button"
                tabIndex={0}
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#7f7f7f]"
                aria-label={labels.clearSelection}
                onClick={handleClear}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleClear(event as unknown as MouseEvent);
                  }
                }}
              >
                <X className="size-3.5" aria-hidden="true" />
              </span>
            </span>
          ) : (
            <span className="truncate text-sm text-[#bdbdbd]">
              {labels.placeholder}
            </span>
          )}
        </button>

        <Select
          key={selectKey}
          open={open}
          onOpenChange={handleOpenChange}
          value={value || undefined}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="inline-flex size-9! shrink-0 items-center justify-center rounded-full border-0 bg-brand p-0! text-white shadow-none focus-visible:ring-brand/20 [&>svg:last-child]:hidden">
            <ChevronDown className="size-4 text-white" aria-hidden="true" />
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
            {deedTypeOptions.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id}
                className="text-base! [&>span:last-child]:w-full"
              >
                <span className="flex w-full min-w-0 items-center justify-between gap-3">
                  <span className="truncate">{labels.types[option.id]}</span>
                  {option.badgeLabel ? (
                    <Badge
                      variant="secondary"
                      className="max-w-[40%] shrink-0 truncate rounded-full bg-brand-background px-2.5 py-0.5 text-[11px] font-semibold text-brand-secondary"
                    >
                      {option.badgeLabel}
                    </Badge>
                  ) : null}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
