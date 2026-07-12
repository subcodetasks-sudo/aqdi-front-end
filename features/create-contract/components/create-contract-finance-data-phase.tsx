"use client";

import CreateContractContractStartDateFields from "@/features/create-contract/components/create-contract-contract-start-date-fields";
import CreateContractFinanceDurationSelect from "@/features/create-contract/components/create-contract-finance-duration-select";
import CreateContractFinanceToggleOption from "@/features/create-contract/components/create-contract-finance-toggle-option";
import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractRentAmountField from "@/features/create-contract/components/create-contract-rent-amount-field";
import { useContractPeriods } from "@/features/create-contract/hooks/use-contract-periods";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { toPropertyContractType } from "@/features/create-contract/types/contract-type";
import {
  PAYMENT_METHOD_OPTIONS,
  type FinanceDataState,
} from "@/features/create-contract/types/finance-step";

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
  const contractPeriodsQuery = useContractPeriods(apiContractType);

  const durationOptions = (contractPeriodsQuery.data ?? []).map((period) => ({
    value: String(period.id),
    label: period.period,
  }));

  const selectedPeriodNote = (contractPeriodsQuery.data ?? []).find(
    (period) => period.id === value.contractPeriodId,
  )?.note;

  const paymentMethodOptions = PAYMENT_METHOD_OPTIONS.map((paymentMethod) => ({
    value: paymentMethod,
    label: labels.paymentMethod.options[paymentMethod],
  }));

  function updateField<K extends keyof FinanceDataState>(
    field: K,
    fieldValue: FinanceDataState[K],
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
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

      <CreateContractFinanceDurationSelect
        label={labels.contractDuration.label}
        placeholder={
          contractPeriodsQuery.isLoading
            ? labels.contractDuration.loading
            : labels.selectPlaceholder
        }
        options={durationOptions}
        value={
          value.contractPeriodId === "" ? "" : String(value.contractPeriodId)
        }
        note={selectedPeriodNote}
        onChange={(contractPeriodId) =>
          updateField("contractPeriodId", Number(contractPeriodId))
        }
      />

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
          placeholder={labels.selectPlaceholder}
          options={paymentMethodOptions}
          value={value.paymentMethod}
          onChange={(paymentMethod) =>
            updateField(
              "paymentMethod",
              paymentMethod as FinanceDataState["paymentMethod"],
            )
          }
        />
      </div>

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
