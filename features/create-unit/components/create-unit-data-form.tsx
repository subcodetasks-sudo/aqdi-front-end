"use client";

import CreateUnitAreaField from "@/features/create-unit/components/create-unit-area-field";
import CreateUnitCheckboxOption, {
  CreateUnitFurnishingTypeToggle,
} from "@/features/create-unit/components/create-unit-checkbox-option";
import CreateUnitFormSelect from "@/features/create-unit/components/create-unit-form-select";
import CreateUnitIconInputField from "@/features/create-unit/components/create-unit-icon-input-field";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitLookupOption } from "@/features/create-unit/types/unit-option";
import {
  buildCountOptions,
  type UnitDataState,
} from "@/features/create-unit/types/unit-data";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { Hash } from "lucide-react";

type CreateUnitDataFormProps = {
  labels: CreateUnitLabels;
  contractType: PropertyContractType;
  onContractTypeChange: (contractType: PropertyContractType) => void;
  unitTypeOptions: UnitLookupOption[];
  unitUsageOptions: UnitLookupOption[];
  value: UnitDataState;
  onChange: (value: UnitDataState) => void;
};

function toSelectOptions(options: UnitLookupOption[]) {
  return options.map((option) => ({
    value: String(option.id),
    label: option.name,
  }));
}

export default function CreateUnitDataForm({
  labels,
  contractType,
  onContractTypeChange,
  unitTypeOptions,
  unitUsageOptions,
  value,
  onChange,
}: CreateUnitDataFormProps) {
  const countOptions = buildCountOptions(20);

  const contractTypeOptions = [
    { value: "housing", label: labels.contractType.options.housing },
    { value: "commercial", label: labels.contractType.options.commercial },
  ] as const;

  const floorOptions = [
    { value: "ground", label: labels.floorOptions.ground },
    ...buildCountOptions(50).slice(1),
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

  return (
    <div className="space-y-5">
      <CreateUnitFormSelect
        label={labels.contractType.label}
        placeholder={labels.selectPlaceholder}
        options={[...contractTypeOptions]}
        value={contractType}
        onChange={(nextValue) =>
          onContractTypeChange(nextValue as PropertyContractType)
        }
      />

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
        <CreateUnitAreaField
          label={labels.totalArea.label}
          placeholder={labels.totalArea.placeholder}
          suffix={labels.totalArea.suffix}
          value={value.totalArea}
          onChange={(totalArea) => updateField("totalArea", totalArea)}
        />

        <CreateUnitFormSelect
          label={labels.floorNumber.label}
          placeholder={labels.selectPlaceholder}
          options={floorOptions}
          value={value.floorNumber}
          onChange={(floorNumber) => updateField("floorNumber", floorNumber)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <CreateUnitIconInputField
          label={labels.unitNumber.label}
          placeholder={labels.unitNumber.placeholder}
          value={value.unitNumber}
          onChange={(unitNumber) => updateField("unitNumber", unitNumber)}
          icon={Hash}
          dir="ltr"
        />

        <CreateUnitFormSelect
          label={labels.roomsCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.roomsCount}
          onChange={(roomsCount) => updateField("roomsCount", roomsCount)}
        />

        <CreateUnitFormSelect
          label={labels.hallsCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.hallsCount}
          onChange={(hallsCount) => updateField("hallsCount", hallsCount)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <CreateUnitFormSelect
          label={labels.kitchensCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.kitchensCount}
          onChange={(kitchensCount) =>
            updateField("kitchensCount", kitchensCount)
          }
        />

        <CreateUnitFormSelect
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
        <CreateUnitFormSelect
          label={labels.windowAcCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.windowAcCount}
          onChange={(windowAcCount) =>
            updateField("windowAcCount", windowAcCount)
          }
        />

        <CreateUnitFormSelect
          label={labels.splitAcCount.label}
          placeholder={labels.selectPlaceholder}
          options={countOptions}
          value={value.splitAcCount}
          onChange={(splitAcCount) => updateField("splitAcCount", splitAcCount)}
        />
      </div>

      <div className="space-y-4 border-t border-[#ececec] pt-5">
        <CreateUnitCheckboxOption
          label={labels.kitchenCabinetsInstalled.label}
          checked={value.kitchenCabinetsInstalled}
          onCheckedChange={(kitchenCabinetsInstalled) =>
            updateField("kitchenCabinetsInstalled", kitchenCabinetsInstalled)
          }
        />

        <CreateUnitCheckboxOption
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
          <CreateUnitFurnishingTypeToggle
            label={labels.furnishingType.label}
            newLabel={labels.furnishingType.new}
            usedLabel={labels.furnishingType.used}
            value={value.furnishingType}
            onChange={(furnishingType) =>
              updateField("furnishingType", furnishingType)
            }
          />
        </CreateUnitCheckboxOption>

        <CreateUnitCheckboxOption
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
          <CreateUnitIconInputField
            label={labels.electricityMeterNumber.label}
            placeholder={labels.electricityMeterNumber.placeholder}
            value={value.electricityMeterNumber}
            onChange={(electricityMeterNumber) =>
              updateField("electricityMeterNumber", electricityMeterNumber)
            }
            icon={Hash}
            dir="ltr"
          />
        </CreateUnitCheckboxOption>

        <CreateUnitCheckboxOption
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
          <CreateUnitIconInputField
            label={labels.waterMeterNumber.label}
            placeholder={labels.waterMeterNumber.placeholder}
            value={value.waterMeterNumber}
            onChange={(waterMeterNumber) =>
              updateField("waterMeterNumber", waterMeterNumber)
            }
            icon={Hash}
            dir="ltr"
          />
        </CreateUnitCheckboxOption>
      </div>
    </div>
  );
}
