"use client";

import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import type {
  BirthDateValue,
  CalendarType,
} from "@/features/create-contract/types/owner-step";
import { cn } from "@/lib/utils";

type BirthDateLabels = {
  label: string;
  hijri: string;
  gregorian: string;
  day: string;
  month: string;
  year: string;
  dayPlaceholder: string;
  monthPlaceholder: string;
  yearPlaceholder: string;
};

type CreateContractBirthDateFieldsProps = {
  labels: BirthDateLabels;
  value: BirthDateValue;
  onChange: (value: BirthDateValue) => void;
};

function padOptions(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { value, label: value };
  });
}

function getYearOptions(calendarType: CalendarType) {
  const start = calendarType === "hijri" ? 1350 : 1940;
  const end = calendarType === "hijri" ? 1450 : 2015;

  return Array.from({ length: end - start + 1 }, (_, index) => {
    const year = String(end - index);
    return { value: year, label: year };
  });
}

export default function CreateContractBirthDateFields({
  labels,
  value,
  onChange,
}: CreateContractBirthDateFieldsProps) {
  const dayCount = value.calendarType === "hijri" ? 30 : 31;

  function updateField<K extends keyof BirthDateValue>(
    field: K,
    fieldValue: BirthDateValue[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
      ...(field === "calendarType"
        ? { day: "", month: "", year: "" }
        : {}),
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-brand">
          {labels.label}
          <span className="text-red-500"> *</span>
        </label>

        <div className="flex items-center rounded-full border border-[#e8e8e8] bg-brand-background p-1">
          {(["hijri", "gregorian"] as const).map((calendarType) => (
            <button
              key={calendarType}
              type="button"
              onClick={() => updateField("calendarType", calendarType)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                value.calendarType === calendarType
                  ? "bg-brand text-white"
                  : "text-[#7f7f7f] hover:text-[#555555]",
              )}
            >
              {labels[calendarType]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CreateContractFormSelect
          label={labels.day}
          placeholder={labels.dayPlaceholder}
          options={padOptions(dayCount)}
          value={value.day}
          onChange={(day) => updateField("day", day)}
        />

        <CreateContractFormSelect
          label={labels.month}
          placeholder={labels.monthPlaceholder}
          options={padOptions(12)}
          value={value.month}
          onChange={(month) => updateField("month", month)}
        />

        <CreateContractFormSelect
          label={labels.year}
          placeholder={labels.yearPlaceholder}
          options={getYearOptions(value.calendarType)}
          value={value.year}
          onChange={(year) => updateField("year", year)}
        />
      </div>
    </div>
  );
}
