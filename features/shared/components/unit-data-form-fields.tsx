"use client";

import { Hash } from "lucide-react";

import CreateUnitAreaField from "@/features/create-unit/components/create-unit-area-field";
import CreateUnitFormSelect from "@/features/create-unit/components/create-unit-form-select";
import CreateUnitIconInputField from "@/features/create-unit/components/create-unit-icon-input-field";
import type { UnitLookupOption } from "@/features/create-unit/types/unit-option";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import MeterRegistrationOptions from "@/features/shared/components/meter-registration-options";
import UnitAdditionalInfoSection from "@/features/shared/components/unit-form/unit-additional-info-section";
import UnitOptionalCheckboxField from "@/features/shared/components/unit-form/unit-optional-checkbox-field";
import UnitOptionalCountField from "@/features/shared/components/unit-form/unit-optional-count-field";
import type { UnitFormLabels } from "@/features/shared/types/unit-form-labels";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { cn } from "@/lib/utils";

type UnitDataFormFieldsProps = {
  labels: UnitFormLabels;
  unitTypeOptions: UnitLookupOption[];
  unitUsageOptions: UnitLookupOption[];
  value: UnitDataState;
  onChange: (value: UnitDataState) => void;
  contractType?: PropertyContractType;
  onContractTypeChange?: (contractType: PropertyContractType) => void;
  electricityMeterFee?: number;
  waterMeterFee?: number;
};

function toSelectOptions(options: UnitLookupOption[]) {
  return options.map((option) => ({
    value: String(option.id),
    label: option.name,
  }));
}

function FurnishingTypeToggle({
  label,
  newLabel,
  usedLabel,
  value,
  onChange,
}: {
  label: string;
  newLabel: string;
  usedLabel: string;
  value: "new" | "used" | "";
  onChange: (value: "new" | "used") => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label className="text-sm font-semibold text-brand">{label}</label>

      <div className="flex items-center rounded-full border border-[#e8e8e8] bg-brand-background p-1">
        {(["new", "used"] as const).map((furnishingType) => (
          <button
            key={furnishingType}
            type="button"
            onClick={() => onChange(furnishingType)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              value === furnishingType
                ? "bg-brand text-white"
                : "text-[#7f7f7f] hover:text-[#555555]",
            )}
          >
            {furnishingType === "new" ? newLabel : usedLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function UnitDataFormFields({
  labels,
  unitTypeOptions,
  unitUsageOptions,
  value,
  onChange,
  contractType,
  onContractTypeChange,
  electricityMeterFee = 0,
  waterMeterFee = 0,
}: UnitDataFormFieldsProps) {
  const floorOptions = [
    { value: "ground", label: labels.floorOptions.ground },
    ...Array.from({ length: 50 }, (_, index) => {
      const floor = String(index + 1);
      return { value: floor, label: floor };
    }),
  ];

  function updateField<K extends keyof UnitDataState>(
    field: K,
    fieldValue: UnitDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  const contractTypeLabel =
    labels.contractType?.linkedLabel ?? labels.contractType?.label ?? "";

  return (
    <div className="space-y-5">
      {labels.contractType && contractType && !onContractTypeChange ? (
        <div>
          <label className="mb-2 block text-sm font-semibold text-brand">
            {contractTypeLabel}
          </label>

          <div className="flex h-14 w-full items-center rounded-full border border-[#e8e8e8] bg-brand-background px-4">
            <span className="text-sm font-semibold text-[#333333]">
              {contractType === "housing"
                ? labels.contractType.options.housing
                : labels.contractType.options.commercial}
            </span>
          </div>
        </div>
      ) : null}

      {labels.contractType && contractType && onContractTypeChange ? (
        <CreateUnitFormSelect
          label={contractTypeLabel}
          placeholder={labels.selectPlaceholder}
          options={[
            { value: "housing", label: labels.contractType.options.housing },
            {
              value: "commercial",
              label: labels.contractType.options.commercial,
            },
          ]}
          value={contractType}
          onChange={(nextValue) =>
            onContractTypeChange(nextValue as PropertyContractType)
          }
        />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <CreateUnitFormSelect
          label={labels.unitType.label}
          placeholder={labels.selectPlaceholder}
          options={toSelectOptions(unitTypeOptions)}
          value={value.unitTypeId}
          onChange={(unitTypeId) => updateField("unitTypeId", unitTypeId)}
        />

        <CreateUnitFormSelect
          label={labels.unitUsage.label}
          placeholder={labels.selectPlaceholder}
          options={toSelectOptions(unitUsageOptions)}
          value={value.unitUsageId}
          onChange={(unitUsageId) => updateField("unitUsageId", unitUsageId)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <CreateUnitIconInputField
          label={labels.unitNumber.label}
          placeholder={labels.unitNumber.placeholder}
          value={value.unitNumber}
          onChange={(unitNumber) => updateField("unitNumber", unitNumber)}
          icon={Hash}
          dir="ltr"
        />

        <CreateUnitFormSelect
          label={labels.floorNumber.label}
          placeholder={labels.selectPlaceholder}
          options={floorOptions}
          value={value.floorNumber}
          onChange={(floorNumber) => updateField("floorNumber", floorNumber)}
        />
      </div>

      <CreateUnitAreaField
        label={labels.totalArea.label}
        placeholder={labels.totalArea.placeholder}
        suffix={labels.totalArea.suffix}
        value={value.totalArea}
        onChange={(totalArea) => updateField("totalArea", totalArea)}
      />

      <UnitAdditionalInfoSection toggleLabel={labels.additionalInfo.toggle}>
        <UnitOptionalCountField
          label={labels.roomsCount.label}
          enabled={value.roomsCount !== ""}
          count={value.roomsCount || "01"}
          onEnabledChange={(enabled) =>
            updateField("roomsCount", enabled ? value.roomsCount || "01" : "")
          }
          onCountChange={(roomsCount) => updateField("roomsCount", roomsCount)}
        />

        <UnitOptionalCountField
          label={labels.hallsCount.label}
          enabled={value.hallsCount !== ""}
          count={value.hallsCount || "01"}
          onEnabledChange={(enabled) =>
            updateField("hallsCount", enabled ? value.hallsCount || "01" : "")
          }
          onCountChange={(hallsCount) => updateField("hallsCount", hallsCount)}
        />

        <UnitOptionalCountField
          label={labels.majlisCount.label}
          enabled={value.majlisCount !== ""}
          count={value.majlisCount || "01"}
          onEnabledChange={(enabled) =>
            updateField("majlisCount", enabled ? value.majlisCount || "01" : "")
          }
          onCountChange={(majlisCount) =>
            updateField("majlisCount", majlisCount)
          }
        />

        <UnitOptionalCountField
          label={labels.kitchensCount.label}
          enabled={value.kitchensCount !== ""}
          count={value.kitchensCount || "01"}
          onEnabledChange={(enabled) =>
            updateField(
              "kitchensCount",
              enabled ? value.kitchensCount || "01" : "",
            )
          }
          onCountChange={(kitchensCount) =>
            updateField("kitchensCount", kitchensCount)
          }
        />

        <UnitOptionalCountField
          label={labels.bathroomsCount.label}
          enabled={value.bathroomsCount !== ""}
          count={value.bathroomsCount || "01"}
          onEnabledChange={(enabled) =>
            updateField(
              "bathroomsCount",
              enabled ? value.bathroomsCount || "01" : "",
            )
          }
          onCountChange={(bathroomsCount) =>
            updateField("bathroomsCount", bathroomsCount)
          }
        />

        <UnitOptionalCountField
          label={labels.windowAcCount.label}
          enabled={value.windowAcCount !== ""}
          count={value.windowAcCount || "01"}
          onEnabledChange={(enabled) =>
            updateField(
              "windowAcCount",
              enabled ? value.windowAcCount || "01" : "",
            )
          }
          onCountChange={(windowAcCount) =>
            updateField("windowAcCount", windowAcCount)
          }
        />

        <UnitOptionalCountField
          label={labels.splitAcCount.label}
          enabled={value.splitAcCount !== ""}
          count={value.splitAcCount || "01"}
          onEnabledChange={(enabled) =>
            updateField("splitAcCount", enabled ? value.splitAcCount || "01" : "")
          }
          onCountChange={(splitAcCount) =>
            updateField("splitAcCount", splitAcCount)
          }
        />

        <UnitOptionalCheckboxField
          label={labels.kitchenCabinetsInstalled.label}
          checked={value.kitchenCabinetsInstalled}
          onCheckedChange={(kitchenCabinetsInstalled) =>
            updateField("kitchenCabinetsInstalled", kitchenCabinetsInstalled)
          }
        />

        <UnitOptionalCheckboxField
          label={labels.furnished.label}
          checked={value.furnished}
          onCheckedChange={(furnished) =>
            onChange({
              ...value,
              furnished,
              furnishingType: furnished ? value.furnishingType : "",
            })
          }
        >
          <FurnishingTypeToggle
            label={labels.furnishingType.label}
            newLabel={labels.furnishingType.new}
            usedLabel={labels.furnishingType.used}
            value={value.furnishingType}
            onChange={(furnishingType) =>
              updateField("furnishingType", furnishingType)
            }
          />
        </UnitOptionalCheckboxField>

        <UnitOptionalCheckboxField
          label={labels.addElectricityMeter.label}
          checked={value.addElectricityMeter}
          onCheckedChange={(addElectricityMeter) =>
            onChange({
              ...value,
              addElectricityMeter,
              electricityMeterNumber: addElectricityMeter
                ? value.electricityMeterNumber
                : "",
              electricityMeterRegistration: addElectricityMeter
                ? value.electricityMeterRegistration
                : "",
            })
          }
        >
          <div className="space-y-3">
            <CreateUnitIconInputField
              label={labels.electricityMeterNumber.label}
              placeholder={
                labels.additionalInfo.writeHerePlaceholder ||
                labels.electricityMeterNumber.placeholder
              }
              value={value.electricityMeterNumber}
              onChange={(electricityMeterNumber) =>
                updateField("electricityMeterNumber", electricityMeterNumber)
              }
              icon={Hash}
              dir="ltr"
              required={false}
              hideLabel
            />

            {labels.meterRegistration ? (
              <MeterRegistrationOptions
                labels={labels.meterRegistration}
                fee={electricityMeterFee}
                value={value.electricityMeterRegistration}
                onChange={(electricityMeterRegistration) =>
                  updateField(
                    "electricityMeterRegistration",
                    electricityMeterRegistration,
                  )
                }
              />
            ) : null}
          </div>
        </UnitOptionalCheckboxField>

        <UnitOptionalCheckboxField
          label={labels.addWaterMeter.label}
          checked={value.addWaterMeter}
          onCheckedChange={(addWaterMeter) =>
            onChange({
              ...value,
              addWaterMeter,
              waterMeterNumber: addWaterMeter ? value.waterMeterNumber : "",
              waterMeterRegistration: addWaterMeter
                ? value.waterMeterRegistration
                : "",
            })
          }
        >
          <div className="space-y-3">
            <CreateUnitIconInputField
              label={labels.waterMeterNumber.label}
              placeholder={
                labels.additionalInfo.writeHerePlaceholder ||
                labels.waterMeterNumber.placeholder
              }
              value={value.waterMeterNumber}
              onChange={(waterMeterNumber) =>
                updateField("waterMeterNumber", waterMeterNumber)
              }
              icon={Hash}
              dir="ltr"
              required={false}
              hideLabel
            />

            {labels.meterRegistration ? (
              <MeterRegistrationOptions
                labels={labels.meterRegistration}
                fee={waterMeterFee}
                value={value.waterMeterRegistration}
                onChange={(waterMeterRegistration) =>
                  updateField("waterMeterRegistration", waterMeterRegistration)
                }
              />
            ) : null}
          </div>
        </UnitOptionalCheckboxField>
      </UnitAdditionalInfoSection>
    </div>
  );
}
