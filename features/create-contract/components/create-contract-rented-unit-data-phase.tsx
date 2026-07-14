"use client";

import UnitDataFormFields from "@/features/shared/components/unit-data-form-fields";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { RentedUnitDataState } from "@/features/create-contract/types/rented-unit-step";
import {
  useUnitTypeOptions,
  useUnitUsageOptions,
} from "@/features/create-unit/hooks/use-unit-lookup-options";
import { useMeterFeeSettings } from "@/features/shared/hooks/use-meter-fee-settings";
import { resolveMeterTransferFee } from "@/features/shared/utils/resolve-meter-transfer-fee";

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
  const contractType =
    useCreateContractDraftStore((state) => state.contractSession?.contractType) ??
    "housing";
  const unitTypesQuery = useUnitTypeOptions(contractType);
  const unitUsageQuery = useUnitUsageOptions(contractType);
  const meterFeesQuery = useMeterFeeSettings();

  const isLoadingOptions =
    unitTypesQuery.isLoading ||
    unitUsageQuery.isLoading ||
    meterFeesQuery.isLoading;
  const optionsError =
    unitTypesQuery.error ?? unitUsageQuery.error ?? meterFeesQuery.error;

  if (optionsError) {
    return (
      <p className="text-sm text-red-500">
        {optionsError instanceof Error
          ? optionsError.message
          : labels.optionsError}
      </p>
    );
  }

  if (isLoadingOptions) {
    return (
      <div className="space-y-3 py-4">
        <div className="h-14 animate-pulse rounded-full bg-brand-background" />
        <div className="h-14 animate-pulse rounded-full bg-brand-background" />
      </div>
    );
  }

  const electricityMeterFee = resolveMeterTransferFee(
    meterFeesQuery.data,
    "electricity",
    contractType,
  );
  const waterMeterFee = resolveMeterTransferFee(
    meterFeesQuery.data,
    "water",
    contractType,
  );

  return (
    <UnitDataFormFields
      labels={labels}
      unitTypeOptions={unitTypesQuery.data ?? []}
      unitUsageOptions={unitUsageQuery.data ?? []}
      value={value}
      onChange={onChange}
      contractType={contractType}
      electricityMeterFee={electricityMeterFee}
      waterMeterFee={waterMeterFee}
    />
  );
}
