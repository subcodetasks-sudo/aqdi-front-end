"use client";

import CreateContractContractStartDateFields from "@/features/create-contract/components/create-contract-contract-start-date-fields";
import CreateContractFinanceDurationSelect from "@/features/create-contract/components/create-contract-finance-duration-select";
import CreateContractFinanceToggleOption from "@/features/create-contract/components/create-contract-finance-toggle-option";
import CreateContractFormSelect from "@/features/create-contract/components/create-contract-form-select";
import CreateContractRentAmountField from "@/features/create-contract/components/create-contract-rent-amount-field";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import {
  CONTRACT_DURATION_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  type FinanceDataState,
} from "@/features/create-contract/types/finance-step";

type CreateContractFinanceDataPhaseProps = {
  labels: CreateContractLabels["finance"];
  value: FinanceDataState;
  onChange: (value: FinanceDataState) => void;
  onOpenTenantPermissions: () => void;
  onOpenOtherConditions: () => void;
};

export default function CreateContractFinanceDataPhase({
  labels,
  value,
  onChange,
  onOpenTenantPermissions,
  onOpenOtherConditions,
}: CreateContractFinanceDataPhaseProps) {
  const durationOptions = CONTRACT_DURATION_OPTIONS.map((duration) => ({
    value: duration,
    label: labels.contractDuration.options[duration],
  }));

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
        placeholder={labels.selectPlaceholder}
        options={durationOptions}
        value={value.contractDuration}
        onChange={(contractDuration) =>
          updateField(
            "contractDuration",
            contractDuration as FinanceDataState["contractDuration"],
          )
        }
      />

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
            updateField("addTenantPermissions", addTenantPermissions)
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
