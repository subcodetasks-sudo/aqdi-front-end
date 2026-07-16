"use client";

import { ChevronLeft } from "lucide-react";
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

type ManualNationalAddressFormProps = {
  labels: ManualNationalAddressLabels;
  value: ManualNationalAddressData;
  onChange: (value: ManualNationalAddressData) => void;
};

function FieldLabel({ label }: { label: string }) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <label className="text-sm font-semibold text-brand">{label}</label>
      <span className="text-red-500">*</span>
    </div>
  );
}

function AddressSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [contentWidth, setContentWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;

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
      <FieldLabel label={label} />

      <div
        ref={containerRef}
        className="flex h-14 w-full items-center gap-2 rounded-full border border-[#e8e8e8] bg-brand-background px-2"
      >
        <div
          className="flex min-w-0 flex-1 items-center px-2"
          onClick={openSelect}
        >
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

function AddressTextField({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const inputId = useId();

  return (
    <div>
      <FieldLabel label={label} />

      <Input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="h-14 rounded-full border-[#e8e8e8] bg-brand-background px-4 text-sm text-[#333333] placeholder:text-[#bdbdbd] focus-visible:ring-brand-secondary/20"
      />
    </div>
  );
}

export default function ManualNationalAddressForm({
  labels,
  value,
  onChange,
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        />

        <AddressSelect
          label={labels.city.label}
          placeholder={
            value.propertyPlaceId === ""
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
        />
      </div>

      <AddressTextField
        label={labels.neighborhood.label}
        placeholder={labels.neighborhood.placeholder}
        value={value.neighborhood}
        onChange={(neighborhood) => updateField("neighborhood", neighborhood)}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AddressTextField
          label={labels.street.label}
          placeholder={labels.street.placeholder}
          value={value.street}
          onChange={(street) => updateField("street", street)}
        />

        <AddressTextField
          label={labels.buildingNumber.label}
          placeholder={labels.buildingNumber.placeholder}
          value={value.buildingNumber}
          onChange={(buildingNumber) =>
            updateField("buildingNumber", buildingNumber)
          }
          inputMode="numeric"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AddressTextField
          label={labels.postalCode.label}
          placeholder={labels.postalCode.placeholder}
          value={value.postalCode}
          onChange={(postalCode) => updateField("postalCode", postalCode)}
          inputMode="numeric"
        />

        <AddressTextField
          label={labels.extraFigure.label}
          placeholder={labels.extraFigure.placeholder}
          value={value.extraFigure}
          onChange={(extraFigure) => updateField("extraFigure", extraFigure)}
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
