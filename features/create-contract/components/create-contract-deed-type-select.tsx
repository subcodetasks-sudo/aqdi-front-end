"use client";

import { Building2, ChevronLeft, Lock, X } from "lucide-react";
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

type CreateContractDeedTypeSelectProps = {
  labels: CreateContractLabels["deed"]["deedType"];
  value: DeedTypeId | "";
  onChange: (value: DeedTypeId | "") => void;
  locked?: boolean;
};

export default function CreateContractDeedTypeSelect({
  labels,
  value,
  onChange,
  locked = false,
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

  function handleContainerClick() {
    if (locked) return;

    openSelect();
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
        <div
          className="flex min-w-0 flex-1 items-center gap-2"
          onClick={handleContainerClick}
        >
          <Building2 className="size-5 shrink-0 text-brand-secondary" />

          <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

          <div className="flex min-w-0 flex-1 items-center px-1">
            {value ? (
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-linear-to-r from-brand-secondary via-brand to-brand px-3 py-1.5 text-sm font-semibold text-white">
                <span className="truncate">{labels.types[value]}</span>
                {locked ? null : (
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center justify-center"
                    aria-label={labels.clearSelection}
                    onClick={handleClear}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </span>
            ) : (
              <button
                type="button"
                className="w-full text-start text-sm text-[#bdbdbd] disabled:cursor-not-allowed"
                onClick={openSelect}
                disabled={locked}
              >
                {labels.placeholder}
              </button>
            )}
          </div>
        </div>

        {locked ? (
          <span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e0e0e0] text-[#9a9a9a]"
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
