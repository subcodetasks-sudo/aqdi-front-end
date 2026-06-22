"use client";

import CreateContractDeedSelectField from "@/features/create-contract/components/create-contract-deed-select-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import {
  FLOOR_COUNTS,
  PROPERTY_AGES,
  PROPERTY_TYPES,
  PROPERTY_USES,
  TOTAL_UNITS,
  UNITS_PER_FLOOR,
  type PropertyDetailsState,
} from "@/features/create-contract/types/property-details";
import { cn } from "@/lib/utils";

type CreateContractDeedPropertyDetailsProps = {
  labels: CreateContractLabels["deed"]["propertyDetails"];
  value: PropertyDetailsState;
  onChange: (value: PropertyDetailsState) => void;
};

export default function CreateContractDeedPropertyDetails({
  labels,
  value,
  onChange,
}: CreateContractDeedPropertyDetailsProps) {
  function updateField<K extends keyof PropertyDetailsState>(
    field: K,
    fieldValue: PropertyDetailsState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CreateContractDeedSelectField
        label={labels.propertyType.label}
        placeholder={labels.propertyType.placeholder}
        options={labels.propertyType.options}
        optionIds={PROPERTY_TYPES}
        value={value.propertyType}
        onChange={(nextValue) => updateField("propertyType", nextValue)}
      />

      <CreateContractDeedSelectField
        label={labels.propertyUse.label}
        placeholder={labels.propertyUse.placeholder}
        options={labels.propertyUse.options}
        optionIds={PROPERTY_USES}
        value={value.propertyUse}
        onChange={(nextValue) => updateField("propertyUse", nextValue)}
      />

      <div className={cn("md:col-span-2")}>
        <CreateContractDeedSelectField
          label={labels.propertyAge.label}
          placeholder={labels.propertyAge.placeholder}
          options={labels.propertyAge.options}
          optionIds={PROPERTY_AGES}
          value={value.propertyAge}
          onChange={(nextValue) => updateField("propertyAge", nextValue)}
        />
      </div>

      <CreateContractDeedSelectField
        label={labels.floorCount.label}
        placeholder={labels.floorCount.placeholder}
        options={labels.floorCount.options}
        optionIds={FLOOR_COUNTS}
        value={value.floorCount}
        onChange={(nextValue) => updateField("floorCount", nextValue)}
      />

      <CreateContractDeedSelectField
        label={labels.unitsPerFloor.label}
        placeholder={labels.unitsPerFloor.placeholder}
        options={labels.unitsPerFloor.options}
        optionIds={UNITS_PER_FLOOR}
        value={value.unitsPerFloor}
        onChange={(nextValue) => updateField("unitsPerFloor", nextValue)}
      />

      <div className={cn("md:col-span-2")}>
        <CreateContractDeedSelectField
          label={labels.totalUnits.label}
          placeholder={labels.totalUnits.placeholder}
          options={labels.totalUnits.options}
          optionIds={TOTAL_UNITS}
          value={value.totalUnits}
          onChange={(nextValue) => updateField("totalUnits", nextValue)}
        />
      </div>
    </div>
  );
}
