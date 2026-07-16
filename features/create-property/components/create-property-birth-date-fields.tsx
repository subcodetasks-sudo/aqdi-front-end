"use client";

import CreatePropertyFormSelect from "@/features/create-property/components/create-property-form-select";
import type { PropertyBirthDateValue } from "@/features/create-property/types/owner-step";
import { getAdultBirthYearOptions } from "@/lib/validation/birth-date-year-options";
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

type CreatePropertyBirthDateFieldsProps = {
  labels: BirthDateLabels;
  value: PropertyBirthDateValue;
  onChange: (value: PropertyBirthDateValue) => void;
};

function padOptions(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { value, label: value };
  });
}

export default function CreatePropertyBirthDateFields({
  labels,
  value,
  onChange,
}: CreatePropertyBirthDateFieldsProps) {
  const dayCount = value.calendarType === "hijri" ? 30 : 31;
  const yearOptions = getAdultBirthYearOptions(value.calendarType);
  const selectedYear = yearOptions.some((option) => option.value === value.year)
    ? value.year
    : "";

  function updateField<K extends keyof PropertyBirthDateValue>(
    field: K,
    fieldValue: PropertyBirthDateValue[K],
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
        <CreatePropertyFormSelect
          label={labels.day}
          placeholder={labels.dayPlaceholder}
          options={padOptions(dayCount)}
          value={value.day}
          onChange={(day) => updateField("day", day)}
        />

        <CreatePropertyFormSelect
          label={labels.month}
          placeholder={labels.monthPlaceholder}
          options={padOptions(12)}
          value={value.month}
          onChange={(month) => updateField("month", month)}
        />

        <CreatePropertyFormSelect
          label={labels.year}
          placeholder={labels.yearPlaceholder}
          options={yearOptions}
          value={selectedYear}
          onChange={(year) => updateField("year", year)}
        />
      </div>
    </div>
  );
}
