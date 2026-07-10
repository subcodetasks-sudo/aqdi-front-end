"use client";

import { Building2, ChevronLeft, User } from "lucide-react";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import CreateContractFieldLabel from "@/features/create-contract/components/create-contract-field-label";
import {
  TENANT_STATUS_OPTIONS,
  type TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractTenantStatusSelectProps = {
  labels: CreateContractLabels["tenant"]["tenantStatus"];
  value: TenantStatusOption | "";
  onChange: (value: TenantStatusOption | "") => void;
};

export default function CreateContractTenantStatusSelect({
  labels,
  value,
  onChange,
}: CreateContractTenantStatusSelectProps) {
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = value ? labels.options[value] : undefined;
  const StatusIcon = value === "individual" ? User : Building2;

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
      <CreateContractFieldLabel label={labels.label} />

      <div
        ref={containerRef}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
        onClick={openSelect}
      >
        <StatusIcon
          className="size-5 shrink-0 text-brand-secondary"
          aria-hidden="true"
        />

        <span className="h-6 w-px shrink-0 bg-[#dcdcdc]" aria-hidden="true" />

        <div className="flex min-w-0 flex-1 items-center px-1">
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
              {labels.placeholder}
            </button>
          )}
        </div>

        <Select
          open={open}
          onOpenChange={handleOpenChange}
          value={value || undefined}
          onValueChange={(nextValue) => {
            onChange(nextValue as TenantStatusOption);
            setOpen(false);
          }}
        >
          <SelectTrigger
            className="inline-flex size-9! shrink-0 items-center justify-center rounded-full border-0 bg-brand-secondary p-0! text-white shadow-none focus-visible:ring-brand-secondary/20 [&>svg:last-child]:hidden"
            onClick={(event) => event.stopPropagation()}
          >
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
            {TENANT_STATUS_OPTIONS.map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="text-base!"
              >
                {labels.options[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
