"use client";

import UnitDataFormFields from "@/features/shared/components/unit-data-form-fields";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitLookupOption } from "@/features/create-unit/types/unit-option";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type CreateUnitDataFormProps = {
  labels: CreateUnitLabels;
  contractType: PropertyContractType;
  contractTypeLocked: boolean;
  onContractTypeChange?: (contractType: PropertyContractType) => void;
  unitTypeOptions: UnitLookupOption[];
  unitUsageOptions: UnitLookupOption[];
  value: UnitDataState;
  onChange: (value: UnitDataState) => void;
};

export default function CreateUnitDataForm({
  labels,
  contractType,
  contractTypeLocked,
  onContractTypeChange,
  unitTypeOptions,
  unitUsageOptions,
  value,
  onChange,
}: CreateUnitDataFormProps) {
  return (
    <UnitDataFormFields
      labels={labels}
      contractType={contractType}
      onContractTypeChange={contractTypeLocked ? undefined : onContractTypeChange}
      unitTypeOptions={unitTypeOptions}
      unitUsageOptions={unitUsageOptions}
      value={value}
      onChange={onChange}
    />
  );
}
