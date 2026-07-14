"use client";

import { ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useContractDocFee } from "@/features/create-contract/hooks/use-contract-doc-fee";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export const CUSTOM_CONTRACT_DURATION_VALUE = "other";

type CustomDurationLabels = {
  yearOption: string;
  monthOption: string;
  monthOptionZero: string;
  loadingPreview: string;
  previewError: string;
};

type CreateContractCustomDurationFieldsProps = {
  labels: CustomDurationLabels;
  years: number | "";
  months: number | "";
  contractId: number | null;
  contractType: PropertyContractType;
  initialLines?: string[];
  onYearsChange: (years: number) => void;
  onMonthsChange: (months: number) => void;
};

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, index) => index + 1);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index);

function withTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function DurationFormSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

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
    <div className="min-w-0 flex-1">
      <div
        ref={containerRef}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <div
          className="flex min-w-0 flex-1 items-center px-2"
          onClick={openSelect}
        >
          <span className="truncate text-sm font-semibold text-[#333333]">
            {selectedLabel}
          </span>
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

export default function CreateContractCustomDurationFields({
  labels,
  years,
  months,
  contractId,
  contractType,
  initialLines = [],
  onYearsChange,
  onMonthsChange,
}: CreateContractCustomDurationFieldsProps) {
  const resolvedYears = years === "" ? 1 : years;
  const resolvedMonths = months === "" ? 0 : months;
  const docFeeQuery = useContractDocFee({
    contractId,
    contractType,
    years: resolvedYears,
    months: resolvedMonths,
    enabled: true,
  });

  const previewLines =
    docFeeQuery.data?.lines && docFeeQuery.data.lines.length > 0
      ? docFeeQuery.data.lines
      : initialLines;

  const yearOptions = YEAR_OPTIONS.map((year) => ({
    value: String(year),
    label: withTemplate(labels.yearOption, { count: year }),
  }));

  const monthOptions = MONTH_OPTIONS.map((month) => ({
    value: String(month),
    label:
      month === 0
        ? labels.monthOptionZero
        : withTemplate(labels.monthOption, { count: month }),
  }));

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <DurationFormSelect
          value={String(resolvedYears)}
          options={yearOptions}
          onChange={(nextYears) => onYearsChange(Number(nextYears))}
        />
        <DurationFormSelect
          value={String(resolvedMonths)}
          options={monthOptions}
          onChange={(nextMonths) => onMonthsChange(Number(nextMonths))}
        />
      </div>

      {docFeeQuery.isLoading && previewLines.length === 0 ? (
        <div className="rounded-xl border border-[#d9eadf] bg-[#f3faf5] px-4 py-3 text-sm text-[#666666]">
          {labels.loadingPreview}
        </div>
      ) : null}

      {docFeeQuery.error && previewLines.length === 0 ? (
        <p className="text-sm text-destructive">
          {docFeeQuery.error instanceof Error
            ? docFeeQuery.error.message
            : labels.previewError}
        </p>
      ) : null}

      {previewLines.length > 0 ? (
        <div className="rounded-xl border border-[#d9eadf] bg-[#f3faf5] px-4 py-3 text-sm leading-7 text-[#333333]">
          {previewLines.map((line, index) => {
            const isTotalLine =
              index === previewLines.length - 1 &&
              (line.includes("إجمالي") || line.toLowerCase().includes("total"));

            return (
              <p
                key={`${line}-${index}`}
                className={isTotalLine ? "font-extrabold text-brand" : undefined}
              >
                {line}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
