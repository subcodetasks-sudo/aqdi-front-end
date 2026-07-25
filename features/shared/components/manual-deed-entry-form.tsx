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
import {
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type FormSelectProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hideLabel?: boolean;
  variant?: "default" | "compact";
  invalid?: boolean;
  valid?: boolean;
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
  showFieldErrors?: boolean;
};

function padOptions(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { value, label: value };
  });
}

function RequiredFieldLabel({
  label,
  invalid = false,
}: {
  label: string;
  invalid?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "text-sm font-semibold",
          invalid ? "text-[#c62828]" : "text-[#333333]",
        )}
      >
        {label}
      </span>
      <span className="text-red-500" aria-hidden="true">
        *
      </span>
    </div>
  );
}

export default function ManualDeedEntryForm({
  labels,
  value,
  onChange,
  FormSelect,
  showFieldErrors = false,
}: ManualDeedEntryFormProps) {
  const inputId = useId();
  const dayCount = value.typeInstrumentHistory === "hijri" ? 30 : 31;
  const yearOptions = getInstrumentHistoryYearOptions(value.typeInstrumentHistory);
  const selectedYear = yearOptions.some((option) => option.value === value.instrumentHistoryYear)
    ? value.instrumentHistoryYear
    : "";
  const instrumentNumberValid =
    value.instrumentNumber.length === INSTRUMENT_NUMBER_LENGTH;
  const instrumentNumberInvalid = showFieldErrors && !instrumentNumberValid;
  const dayInvalid = showFieldErrors && value.instrumentHistoryDay === "";
  const monthInvalid = showFieldErrors && value.instrumentHistoryMonth === "";
  const yearInvalid = showFieldErrors && selectedYear === "";
  const instrumentDateInvalid = dayInvalid || monthInvalid || yearInvalid;
  const instrumentNumberChrome = resolveFieldChromeState({
    invalid: instrumentNumberInvalid,
    valid: instrumentNumberValid,
  });

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
    <div className="space-y-6">
      <div className="space-y-2">
        <RequiredFieldLabel
          label={labels.instrumentNumber.label}
          invalid={instrumentNumberInvalid}
        />

        <div className="relative">
          <Input
            id={inputId}
            inputMode="numeric"
            maxLength={INSTRUMENT_NUMBER_LENGTH}
            value={value.instrumentNumber}
            placeholder={labels.instrumentNumber.placeholder}
            aria-invalid={instrumentNumberInvalid}
            onChange={(event) =>
              updateField(
                "instrumentNumber",
                normalizeInstrumentNumber(event.target.value),
              )
            }
            className={cn(
              "h-12 rounded-2xl ps-4 pe-14 text-start text-sm font-semibold tracking-[0.2em] placeholder:tracking-[0.2em] placeholder:text-[#cfcfcf] md:text-sm",
              fieldChromeSurfaceClass(instrumentNumberChrome, {
                defaultBgClassName: "bg-white",
              }),
            )}
          />

          <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-[#bdbdbd]">
            {value.instrumentNumber.length}/{INSTRUMENT_NUMBER_LENGTH}
          </span>
        </div>

        <p className="text-xs text-[#8a8a8a]">{labels.instrumentNumber.hint}</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <RequiredFieldLabel
            label={labels.instrumentDate.label}
            invalid={instrumentDateInvalid}
          />

          <div className="inline-flex shrink-0 items-center rounded-full bg-[#f0f0f0] p-1">
            {(["hijri", "gregorian"] as const).map((calendarType) => (
              <button
                key={calendarType}
                type="button"
                onClick={() => updateField("typeInstrumentHistory", calendarType)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors sm:px-5",
                  value.typeInstrumentHistory === calendarType
                    ? "bg-brand text-white"
                    : "text-[#555555] hover:text-[#333333]",
                )}
              >
                {labels.instrumentDate[calendarType]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <FormSelect
            label={labels.instrumentDate.day}
            placeholder={labels.instrumentDate.dayPlaceholder}
            options={padOptions(dayCount)}
            value={value.instrumentHistoryDay}
            onChange={(day) => updateField("instrumentHistoryDay", day)}
            hideLabel
            variant="compact"
            valid={value.instrumentHistoryDay !== ""}
            invalid={dayInvalid}
          />

          <FormSelect
            label={labels.instrumentDate.month}
            placeholder={labels.instrumentDate.monthPlaceholder}
            options={padOptions(12)}
            value={value.instrumentHistoryMonth}
            onChange={(month) => updateField("instrumentHistoryMonth", month)}
            hideLabel
            variant="compact"
            valid={value.instrumentHistoryMonth !== ""}
            invalid={monthInvalid}
          />

          <FormSelect
            label={labels.instrumentDate.year}
            placeholder={labels.instrumentDate.yearPlaceholder}
            options={yearOptions}
            value={selectedYear}
            onChange={(year) => updateField("instrumentHistoryYear", year)}
            hideLabel
            variant="compact"
            valid={selectedYear !== ""}
            invalid={yearInvalid}
          />
        </div>
      </div>
    </div>
  );
}
