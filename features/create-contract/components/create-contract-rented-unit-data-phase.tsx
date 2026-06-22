"use client";

import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractIconInputField from "@/features/create-contract/components/create-contract-icon-input-field";
import CreateContractRentedUnitAreaField from "@/features/create-contract/components/create-contract-rented-unit-area-field";
import CreateContractRentedUnitCheckboxOption, {
  CreateContractFurnishingTypeToggle,
} from "@/features/create-contract/components/create-contract-rented-unit-checkbox-option";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import {
  UNIT_TYPE_OPTIONS,
  UNIT_USAGE_OPTIONS,
  buildCountOptions,
  type RentedUnitDataState,
} from "@/features/create-contract/types/rented-unit-step";
import { Hash } from "lucide-react";

type CreateContractRentedUnitDataPhaseProps = {
  labels: CreateContractLabels["tenant"]["rentedUnit"];
  value: RentedUnitDataState;
  onChange: (value: RentedUnitDataState) => void;
};

export default function CreateContractRentedUnitDataPhase({
  labels,
  value,
  onChange,
}: CreateContractRentedUnitDataPhaseProps) {
  const countOptions = buildCountOptions(20).map((option) => ({
    ...option,
    label: option.label,
  }));

  const floorOptions = [
    { value: "ground", label: labels.floorOptions.ground },
    ...buildCountOptions(50).slice(1).map((option) => ({
      value: option.value,
      label: option.label,
    })),
  ];

  const unitTypeOptions = UNIT_TYPE_OPTIONS.map((unitType) => ({
    value: unitType,
    label: labels.unitType.options[unitType],
  }));

  const unitUsageOptions = UNIT_USAGE_OPTIONS.map((unitUsage) => ({
    value: unitUsage,
    label: labels.unitUsage.options[unitUsage],
  }));

  function updateField<K extends keyof RentedUnitDataState>(
    field: K,
    fieldValue: RentedUnitDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        <CreateContractFormSelect
          label={labels.unitType.label}
          placeholder={labels.selectPlaceholder}
          options={unitTypeOptions}
          value={value.unitType}
          onChange={(unitType) =>
            updateField("unitType", unitType as RentedUnitDataState["unitType"])
          }
        />

        <CreateContractFormSelect
          label={labels.unitUsage.label}
          placeholder={labels.selectPlaceholder}
          options={unitUsageOptions}
          value={value.unitUsage}
          onChange={(unitUsage) =>
            updateField(
              "unitUsage",
              unitUsage as RentedUnitDataState["unitUsage"],
            )
          }
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <CreateContractRentedUnitAreaField
          label={labels.totalArea.label}
          placeholder={labels.totalArea.placeholder}
          suffix={labels.totalArea.suffix}
          value={value.totalArea}
          onChange={(totalArea) => updateField("totalArea", totalArea)}
        />

        <CreateContractFormSelect
          label={labels.floorNumber.label}
          placeholder={labels.selectPlaceholder}
          options={floorOptions}
          value={value.floorNumber}
          onChange={(floorNumber) => updateField("floorNumber", floorNumber)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CreateContractIconInputField
          label={labels.unitNumber.label}
          placeholder={labels.unitNumber.placeholder}
          value={value.unitNumber}
          onChange={(unitNumber) => updateField("unitNumber", unitNumber)}
          icon={Hash}
          dir="ltr"
        />

        <CreateContractFormSelect
          label={labels.roomsCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.roomsCount}
          onChange={(roomsCount) => updateField("roomsCount", roomsCount)}
        />

        <CreateContractFormSelect
          label={labels.hallsCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.hallsCount}
          onChange={(hallsCount) => updateField("hallsCount", hallsCount)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CreateContractFormSelect
          label={labels.majlisCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.majlisCount}
          onChange={(majlisCount) => updateField("majlisCount", majlisCount)}
        />

        <CreateContractFormSelect
          label={labels.kitchensCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.kitchensCount}
          onChange={(kitchensCount) => updateField("kitchensCount", kitchensCount)}
        />

        <CreateContractFormSelect
          label={labels.bathroomsCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.bathroomsCount}
          onChange={(bathroomsCount) =>
            updateField("bathroomsCount", bathroomsCount)
          }
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <CreateContractFormSelect
          label={labels.windowAcCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.windowAcCount}
          onChange={(windowAcCount) => updateField("windowAcCount", windowAcCount)}
        />

        <CreateContractFormSelect
          label={labels.splitAcCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.splitAcCount}
          onChange={(splitAcCount) => updateField("splitAcCount", splitAcCount)}
        />
      </div>

      <div className="space-y-4 border-t border-[#ececec] pt-5">
        <CreateContractRentedUnitCheckboxOption
          label={labels.kitchenCabinetsInstalled.label}
          checked={value.kitchenCabinetsInstalled}
          onCheckedChange={(kitchenCabinetsInstalled) =>
            updateField("kitchenCabinetsInstalled", kitchenCabinetsInstalled)
          }
        />

        <CreateContractRentedUnitCheckboxOption
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
          <CreateContractFurnishingTypeToggle
            label={labels.furnishingType.label}
            newLabel={labels.furnishingType.new}
            usedLabel={labels.furnishingType.used}
            value={value.furnishingType}
            onChange={(furnishingType) =>
              updateField("furnishingType", furnishingType)
            }
          />
        </CreateContractRentedUnitCheckboxOption>

        <CreateContractRentedUnitCheckboxOption
          label={labels.addElectricityMeter.label}
          checked={value.addElectricityMeter}
          onCheckedChange={(addElectricityMeter) =>
            onChange({
              ...value,
              addElectricityMeter,
              electricityMeterNumber: addElectricityMeter
                ? value.electricityMeterNumber
                : "",
            })
          }
        >
          <CreateContractIconInputField
            label={labels.electricityMeterNumber.label}
            placeholder={labels.electricityMeterNumber.placeholder}
            value={value.electricityMeterNumber}
            onChange={(electricityMeterNumber) =>
              updateField("electricityMeterNumber", electricityMeterNumber)
            }
            icon={Hash}
            dir="ltr"
          />
        </CreateContractRentedUnitCheckboxOption>

        <CreateContractRentedUnitCheckboxOption
          label={labels.addWaterMeter.label}
          checked={value.addWaterMeter}
          onCheckedChange={(addWaterMeter) =>
            onChange({
              ...value,
              addWaterMeter,
              waterMeterNumber: addWaterMeter ? value.waterMeterNumber : "",
            })
          }
        >
          <CreateContractIconInputField
            label={labels.waterMeterNumber.label}
            placeholder={labels.waterMeterNumber.placeholder}
            value={value.waterMeterNumber}
            onChange={(waterMeterNumber) =>
              updateField("waterMeterNumber", waterMeterNumber)
            }
            icon={Hash}
            dir="ltr"
          />
        </CreateContractRentedUnitCheckboxOption>
      </div>
    </div>
  );
}
