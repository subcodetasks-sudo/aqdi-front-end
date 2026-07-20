"use client";

import { useId, type ComponentType } from "react";

import { Input } from "@/components/ui/input";
import type { ManualDeedEntryLabels } from "@/features/shared/types/manual-deed-entry-labels";
import {
  INSTRUMENT_NUMBER_LENGTH,
  normalizeInstrumentNumber,
  type ManualDeedEntryData,
} from "@/features/shared/types/manual-deed-entry";
import { getInstrumentHistoryYearOptions } from "@/lib/validation/instrument-history-year-options";
import { cn } from "@/lib/utils";

type FormSelectProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

type FieldLabelProps = {
  label: string;
};

type ManualDeedEntryFormProps = {
  labels: ManualDeedEntryLabels;
  value: ManualDeedEntryData;
  onChange: (value: ManualDeedEntryData) => void;
  FormSelect: ComponentType<FormSelectProps>;
  FieldLabel: ComponentType<FieldLabelProps>;
};

function padOptions(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { value, label: value };
  });
}

export default function ManualDeedEntryForm({
  labels,
  value,
  onChange,
  FormSelect,
  FieldLabel,
}: ManualDeedEntryFormProps) {
  const inputId = useId();
  const dayCount = value.typeInstrumentHistory === "hijri" ? 30 : 31;
  const yearOptions = getInstrumentHistoryYearOptions(value.typeInstrumentHistory);
  const selectedYear = yearOptions.some((option) => option.value === value.instrumentHistoryYear)
    ? value.instrumentHistoryYear
    : "";

  function updateField<K extends keyof ManualDeedEntryData>(
    field: K,
    fieldValue: ManualDeedEntryData[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
      ...(field === "typeInstrumentHistory"
        ? {
            instrumentHistoryDay: "",
            instrumentHistoryMonth: "",
            instrumentHistoryYear: "",
          }
        : {}),
    });
  }

  return (
    <div className="space-y-6 rounded-3xl bg-brand-background p-5 md:p-6">
      <div className="space-y-2">
        <FieldLabel label={labels.instrumentNumber.label} />

        <div className="relative">
          <Input
            id={inputId}
            inputMode="numeric"
            maxLength={INSTRUMENT_NUMBER_LENGTH}
            value={value.instrumentNumber}
            placeholder={labels.instrumentNumber.placeholder}
            onChange={(event) =>
              updateField(
                "instrumentNumber",
                normalizeInstrumentNumber(event.target.value),
              )
            }
            className="h-12 rounded-full border-[#e8e8e8] bg-white pe-16 text-end font-semibold tracking-widest"
          />

          <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-[#bdbdbd]">
            {value.instrumentNumber.length}/{INSTRUMENT_NUMBER_LENGTH}
          </span>
        </div>

        <p className="text-xs text-[#7f7f7f]">{labels.instrumentNumber.hint}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-brand">
            {labels.instrumentDate.label}
            <span className="text-red-500"> *</span>
          </label>

          <div className="flex items-center rounded-full border border-[#e8e8e8] bg-white p-1">
            {(["hijri", "gregorian"] as const).map((calendarType) => (
              <button
                key={calendarType}
                type="button"
                onClick={() => updateField("typeInstrumentHistory", calendarType)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  value.typeInstrumentHistory === calendarType
                    ? "bg-brand text-white"
                    : "text-[#7f7f7f] hover:text-[#555555]",
                )}
              >
                {labels.instrumentDate[calendarType]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <FormSelect
            label={labels.instrumentDate.day}
            placeholder={labels.instrumentDate.dayPlaceholder}
            options={padOptions(dayCount)}
            value={value.instrumentHistoryDay}
            onChange={(day) => updateField("instrumentHistoryDay", day)}
          />

          <FormSelect
            label={labels.instrumentDate.month}
            placeholder={labels.instrumentDate.monthPlaceholder}
            options={padOptions(12)}
            value={value.instrumentHistoryMonth}
            onChange={(month) => updateField("instrumentHistoryMonth", month)}
          />

          <FormSelect
            label={labels.instrumentDate.year}
            placeholder={labels.instrumentDate.yearPlaceholder}
            options={yearOptions}
            value={selectedYear}
            onChange={(year) => updateField("instrumentHistoryYear", year)}
          />
        </div>
      </div>
    </div>
  );
}
