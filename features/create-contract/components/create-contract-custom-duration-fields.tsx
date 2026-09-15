"use client";

import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import { useContractDocFee } from "@/features/create-contract/hooks/use-contract-doc-fee";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export const CUSTOM_CONTRACT_DURATION_VALUE = "other";

type CustomDurationLabels = {
  yearsLabel: string;
  yearsPlaceholder: string;
  monthsLabel: string;
  monthsPlaceholder: string;
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
        <CreateContractFormSelect
          label={labels.yearsLabel}
          placeholder={labels.yearsPlaceholder}
          options={yearOptions}
          value={String(resolvedYears)}
          onChange={(nextYears) => onYearsChange(Number(nextYears))}
          variant="compact"
        />
        <CreateContractFormSelect
          label={labels.monthsLabel}
          placeholder={labels.monthsPlaceholder}
          options={monthOptions}
          value={String(resolvedMonths)}
          onChange={(nextMonths) => onMonthsChange(Number(nextMonths))}
          variant="compact"
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
