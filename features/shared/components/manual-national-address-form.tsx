"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  useCityOptions,
  useRegionOptions,
} from "@/features/create-contract/hooks/use-location-lookup-options";
import type {
  ManualNationalAddressData,
  ManualNationalAddressLabels,
} from "@/features/shared/types/manual-national-address";
import {
  fieldChromeSurfaceClass,
  resolveFieldChromeState,
} from "@/lib/ui/field-chrome";
import { cn } from "@/lib/utils";

type ManualNationalAddressFormProps = {
  labels: ManualNationalAddressLabels;
  value: ManualNationalAddressData;
  onChange: (value: ManualNationalAddressData) => void;
  showFieldErrors?: boolean;
};

function FieldLabel({
  label,
  required = true,
  invalid = false,
}: {
  label: string;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <label
        className={cn(
          "text-sm font-semibold",
          invalid ? "text-[#c62828]" : "text-[#333333]",
        )}
      >
        {label}
      </label>
      {required ? (
        <span className="text-red-500" aria-hidden="true">
          *
        </span>
      ) : null}
    </div>
  );
}

function AddressSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  invalid = false,
  valid = false,
}: {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  valid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;
  const chrome = resolveFieldChromeState({ invalid, valid });

  function handleOpenChange(nextOpen: boolean) {
    if (disabled) {
      return;
    }

    if (nextOpen && containerRef.current) {
      setContentWidth(containerRef.current.offsetWidth);
    }

    setOpen(nextOpen);
  }

  function openSelect() {
    if (disabled) {
      return;
    }

    if (containerRef.current) {
      setContentWidth(containerRef.current.offsetWidth);
    }

    setOpen(true);
  }

  return (
    <div className="min-w-0">
      <FieldLabel label={label} invalid={invalid} />

      <div
        ref={containerRef}
        className={cn(
          "flex h-12 w-full items-center gap-2 rounded-2xl border px-3",
          fieldChromeSurfaceClass(chrome, {
            defaultBgClassName: "bg-white",
          }),
          disabled && "opacity-70",
        )}
      >
        <div
          className="flex min-w-0 flex-1 items-center"
          onClick={openSelect}
        >
          {value ? (
            <span className="truncate text-sm font-semibold text-[#333333]">
              {selectedLabel}
            </span>
          ) : (
            <button
              type="button"
              disabled={disabled}
              aria-label={label}
              className="w-full text-start text-sm text-[#bdbdbd] disabled:cursor-not-allowed"
              onClick={openSelect}
            >
              {placeholder}
            </button>
          )}
        </div>

        <Select
          open={open}
          onOpenChange={handleOpenChange}
          value={value || undefined}
          onValueChange={(nextValue) => {
            onChange(nextValue);
            setOpen(false);
          }}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label={label}
            className="inline-flex size-7! shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0! text-[#333333] shadow-none focus-visible:ring-0 [&>svg:last-child]:hidden"
          >
            <ChevronDown className="size-4 text-[#333333]" aria-hidden="true" />
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

function AddressTextField({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
  required = true,
  align = "start",
  invalid = false,
  valid = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
  align?: "start" | "end";
  invalid?: boolean;
  valid?: boolean;
}) {
  const inputId = useId();
  const chrome = resolveFieldChromeState({ invalid, valid });

  return (
    <div className="min-w-0">
      <FieldLabel label={label} required={required} invalid={invalid} />

      <Input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={invalid}
        className={cn(
          "h-12 rounded-2xl px-4 text-sm font-medium text-[#333333] placeholder:text-[#bdbdbd] focus-visible:border-brand/40 focus-visible:ring-brand/15",
          fieldChromeSurfaceClass(chrome, {
            defaultBgClassName: "bg-white",
          }),
          align === "end" ? "text-end" : "text-start",
        )}
      />
    </div>
  );
}

export default function ManualNationalAddressForm({
  labels,
  value,
  onChange,
  showFieldErrors = false,
}: ManualNationalAddressFormProps) {
  const { data: regions = [], isLoading: isRegionsLoading } = useRegionOptions();
  const { data: cities = [], isLoading: isCitiesLoading } = useCityOptions(
    value.propertyPlaceId,
  );

  const regionOptions = regions.map((region) => ({
    value: String(region.id),
    label: region.name,
  }));
  const cityOptions = cities.map((city) => ({
    value: String(city.id),
    label: city.name,
  }));
  const cityDisabled = value.propertyPlaceId === "";

  function updateField<K extends keyof ManualNationalAddressData>(
    field: K,
    fieldValue: ManualNationalAddressData[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="space-y-4">
      <AddressSelect
        label={labels.place.label}
        placeholder={
          isRegionsLoading ? labels.place.loading : labels.place.placeholder
        }
        options={regionOptions}
        value={value.propertyPlaceId === "" ? "" : String(value.propertyPlaceId)}
        onChange={(placeId) => {
          onChange({
            ...value,
            propertyPlaceId: placeId ? Number(placeId) : "",
            propertyCityId: "",
          });
        }}
        invalid={showFieldErrors && value.propertyPlaceId === ""}
        valid={value.propertyPlaceId !== ""}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <AddressSelect
          label={labels.city.label}
          placeholder={
            cityDisabled
              ? labels.city.selectPlaceFirst
              : isCitiesLoading
                ? labels.city.loading
                : labels.city.placeholder
          }
          options={cityOptions}
          value={value.propertyCityId === "" ? "" : String(value.propertyCityId)}
          onChange={(cityId) =>
            updateField("propertyCityId", cityId ? Number(cityId) : "")
          }
          disabled={cityDisabled}
          invalid={showFieldErrors && value.propertyCityId === ""}
          valid={value.propertyCityId !== ""}
        />

        <AddressTextField
          label={labels.neighborhood.label}
          placeholder={labels.neighborhood.placeholder}
          value={value.neighborhood}
          onChange={(neighborhood) => updateField("neighborhood", neighborhood)}
          invalid={showFieldErrors && value.neighborhood.trim() === ""}
          valid={value.neighborhood.trim() !== ""}
        />

        <AddressTextField
          label={labels.street.label}
          placeholder={labels.street.placeholder}
          value={value.street}
          onChange={(street) => updateField("street", street)}
          invalid={showFieldErrors && value.street.trim() === ""}
          valid={value.street.trim() !== ""}
        />

        <AddressTextField
          label={labels.buildingNumber.label}
          placeholder={labels.buildingNumber.placeholder}
          value={value.buildingNumber}
          onChange={(buildingNumber) =>
            updateField("buildingNumber", buildingNumber)
          }
          inputMode="numeric"
          align="end"
          invalid={showFieldErrors && value.buildingNumber.trim() === ""}
          valid={value.buildingNumber.trim() !== ""}
        />

        <AddressTextField
          label={labels.postalCode.label}
          placeholder={labels.postalCode.placeholder}
          value={value.postalCode}
          onChange={(postalCode) => updateField("postalCode", postalCode)}
          inputMode="numeric"
          align="end"
          invalid={showFieldErrors && value.postalCode.trim() === ""}
          valid={value.postalCode.trim() !== ""}
        />

        <AddressTextField
          label={labels.extraFigure.label}
          placeholder={labels.extraFigure.placeholder}
          value={value.extraFigure}
          onChange={(extraFigure) => updateField("extraFigure", extraFigure)}
          inputMode="numeric"
          align="end"
          invalid={showFieldErrors && value.extraFigure.trim() === ""}
          valid={value.extraFigure.trim() !== ""}
        />
      </div>
    </div>
  );
}
