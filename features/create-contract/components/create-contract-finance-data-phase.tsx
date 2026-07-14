"use client";

import { ArrowLeft, Hand } from "lucide-react";

import CreateContractContractStartDateFields from "@/features/create-contract/components/create-contract-contract-start-date-fields";
import CreateContractCustomDurationFields, {
  CUSTOM_CONTRACT_DURATION_VALUE,
} from "@/features/create-contract/components/create-contract-custom-duration-fields";
import CreateContractFinanceDurationSelect from "@/features/create-contract/components/create-contract-finance-duration-select";
import CreateContractFinanceToggleOption from "@/features/create-contract/components/create-contract-finance-toggle-option";
import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractRentAmountField from "@/features/create-contract/components/create-contract-rent-amount-field";
import { useContractPeriods } from "@/features/create-contract/hooks/use-contract-periods";
import { usePaymentTypes } from "@/features/create-contract/hooks/use-payment-types";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { toPropertyContractType } from "@/features/create-contract/types/contract-type";
import type { FinanceDataState } from "@/features/create-contract/types/finance-step";
import { getDocFeeLinesFromStep6 } from "@/features/create-contract/utils/build-finance-data-from-step6";

type CreateContractFinanceDataPhaseProps = {
  labels: CreateContractLabels["finance"];
  contractType: ContractTypeId;
  value: FinanceDataState;
  onChange: (value: FinanceDataState) => void;
  onOpenTenantPermissions: () => void;
  onOpenOtherConditions: () => void;
};

export default function CreateContractFinanceDataPhase({
  labels,
  contractType,
  value,
  onChange,
  onOpenTenantPermissions,
  onOpenOtherConditions,
}: CreateContractFinanceDataPhaseProps) {
  const apiContractType = toPropertyContractType(contractType);
  const contractId = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.contractId ??
      state.contractStep5Data?.contract_id ??
      state.contractStep6Data?.contract_id ??
      null,
  );
  const contractStep6Data = useCreateContractDraftStore(
    (state) => state.contractStep6Data,
  );
  const contractPeriodsQuery = useContractPeriods(apiContractType);
  const paymentTypesQuery = usePaymentTypes(apiContractType);

  const durationOptions = [
    ...(contractPeriodsQuery.data ?? []).map((period) => ({
      value: String(period.id),
      label: period.period,
    })),
    {
      value: CUSTOM_CONTRACT_DURATION_VALUE,
      label: labels.contractDuration.otherOption,
    },
  ];

  const selectedPeriodNote = value.isCustomDuration
    ? undefined
    : (contractPeriodsQuery.data ?? []).find(
        (period) => period.id === value.contractPeriodId,
      )?.note;

  const paymentTypeOptions = (paymentTypesQuery.data ?? []).map(
    (paymentType) => ({
      value: String(paymentType.id),
      label: paymentType.name,
    }),
  );

  const selectedPaymentTypeNotes = (paymentTypesQuery.data ?? [])
    .find((paymentType) => paymentType.id === value.paymentTypeId)
    ?.notes?.trim();

  const initialDocFeeLines = value.isCustomDuration
    ? getDocFeeLinesFromStep6(contractStep6Data)
    : [];

  function updateField<K extends keyof FinanceDataState>(
    field: K,
    fieldValue: FinanceDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  function handleDurationChange(nextValue: string) {
    if (nextValue === CUSTOM_CONTRACT_DURATION_VALUE) {
      onChange({
        ...value,
        isCustomDuration: true,
        contractPeriodId: "",
        customDurationYears:
          value.customDurationYears === "" ? 1 : value.customDurationYears,
        customDurationMonths:
          value.customDurationMonths === "" ? 0 : value.customDurationMonths,
      });
      return;
    }

    onChange({
      ...value,
      isCustomDuration: false,
      contractPeriodId: Number(nextValue),
    });
  }

  return (
    <div className="space-y-5">
      <CreateContractContractStartDateFields
        labels={labels.contractStartDate}
        value={value.contractStartDate}
        onChange={(contractStartDate) =>
          updateField("contractStartDate", contractStartDate)
        }
      />

      <div className="space-y-3">
        <CreateContractFinanceDurationSelect
          label={labels.contractDuration.label}
          placeholder={
            contractPeriodsQuery.isLoading
              ? labels.contractDuration.loading
              : labels.selectPlaceholder
          }
          options={durationOptions}
          value={
            value.isCustomDuration
              ? CUSTOM_CONTRACT_DURATION_VALUE
              : value.contractPeriodId === ""
                ? ""
                : String(value.contractPeriodId)
          }
          note={selectedPeriodNote}
          onChange={handleDurationChange}
        />

        {value.isCustomDuration ? (
          <CreateContractCustomDurationFields
            labels={labels.contractDuration.custom}
            years={value.customDurationYears}
            months={value.customDurationMonths}
            contractId={contractId}
            contractType={apiContractType}
            initialLines={initialDocFeeLines}
            onYearsChange={(customDurationYears) =>
              updateField("customDurationYears", customDurationYears)
            }
            onMonthsChange={(customDurationMonths) =>
              updateField("customDurationMonths", customDurationMonths)
            }
          />
        ) : null}
      </div>

      {contractPeriodsQuery.error ? (
        <p className="text-sm text-destructive">
          {labels.contractDuration.optionsError}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <CreateContractRentAmountField
          label={labels.totalRentAmount.label}
          placeholder={labels.totalRentAmount.placeholder}
          value={value.totalRentAmount}
          onChange={(totalRentAmount) =>
            updateField("totalRentAmount", totalRentAmount)
          }
        />

        <CreateContractFormSelect
          label={labels.paymentMethod.label}
          placeholder={
            paymentTypesQuery.isLoading
              ? labels.paymentMethod.loading
              : labels.selectPlaceholder
          }
          options={paymentTypeOptions}
          value={value.paymentTypeId === "" ? "" : String(value.paymentTypeId)}
          onChange={(paymentTypeId) =>
            updateField("paymentTypeId", Number(paymentTypeId))
          }
        />
      </div>

      {paymentTypesQuery.error ? (
        <p className="text-sm text-destructive">
          {labels.paymentMethod.optionsError}
        </p>
      ) : null}

      {selectedPaymentTypeNotes ? (
        <p className="flex items-center gap-1.5 text-sm text-[#555555]">
          <Hand className="size-4 shrink-0 text-red-500" aria-hidden="true" />
          <ArrowLeft
            className="size-3.5 shrink-0 text-red-500"
            aria-hidden="true"
          />
          <span>{selectedPaymentTypeNotes}</span>
        </p>
      ) : null}

      <div className="space-y-4 pt-2">
        <CreateContractFinanceToggleOption
          label={labels.addTenantPermissions.label}
          checked={value.addTenantPermissions}
          onCheckedChange={(addTenantPermissions) =>
            onChange({
              ...value,
              addTenantPermissions,
              selectedTenantRoleIds: addTenantPermissions
                ? value.selectedTenantRoleIds
                : [],
            })
          }
          actionLabel={labels.addTenantPermissions.edit}
          actionVariant="edit"
          onAction={onOpenTenantPermissions}
        />

        <CreateContractFinanceToggleOption
          label={labels.addOtherConditions.label}
          checked={value.addOtherConditions}
          onCheckedChange={(addOtherConditions) =>
            updateField("addOtherConditions", addOtherConditions)
          }
          actionLabel={labels.addOtherConditions.add}
          actionVariant="add"
          onAction={onOpenOtherConditions}
        />
      </div>
    </div>
  );
}
