"use client";

import { Building2, ChevronDown, Lock, X } from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { useSettingContracts } from "@/features/shared/hooks/use-setting-contracts";
import { resolveContractSettingContractOptions } from "@/features/shared/utils/resolve-setting-contract-options";
import {
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type CreateContractDeedTypeSelectProps = {
  labels: CreateContractLabels["deed"]["deedType"];
  value: DeedTypeId | "";
  onChange: (value: DeedTypeId | "") => void;
  locked?: boolean;
  invalid?: boolean;
};

export default function CreateContractDeedTypeSelect({
  labels,
  value,
  onChange,
  locked = false,
  invalid = false,
}: CreateContractDeedTypeSelectProps) {
  const [selectKey, setSelectKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: settingContracts } = useSettingContracts();
  const deedTypeOptions = resolveContractSettingContractOptions(
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
    if (locked) {
      return;
    }

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
    onChange(nextValue as DeedTypeId);
    setOpen(false);
  }

  return (
    <div>
      <CreateContractFieldLabel label={labels.label} invalid={invalid} />

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
          className="flex min-w-0 flex-1 items-center gap-2 text-start disabled:cursor-not-allowed"
          onClick={openSelect}
          disabled={locked}
        >
          <Building2 className="size-5 shrink-0 text-brand-secondary" aria-hidden="true" />
          <span className="h-5 w-px shrink-0 bg-[#e8e8e8]" aria-hidden="true" />

          {value ? (
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm font-semibold text-[#333333]">
                {labels.types[value]}
              </span>
              {!locked ? (
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
              ) : null}
            </span>
          ) : (
            <span className="truncate text-sm text-[#bdbdbd]">{labels.placeholder}</span>
          )}
        </button>

        {locked ? (
          <span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eeeeee] text-[#9a9a9a]"
            aria-hidden="true"
          >
            <Lock className="size-4" />
          </span>
        ) : (
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
        )}
      </div>
    </div>
  );
}
