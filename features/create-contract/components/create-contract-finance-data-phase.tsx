"use client";

import CreateContractContractStartDateFields from "@/features/create-contract/components/create-contract-contract-start-date-fields";
import CreateContractCustomDurationFields, {
  CUSTOM_CONTRACT_DURATION_VALUE,
} from "@/features/create-contract/components/create-contract-custom-duration-fields";
import CreateContractFinanceConditionsSection from "@/features/create-contract/components/create-contract-finance-conditions-section";
import CreateContractFinanceDurationSelect from "@/features/create-contract/components/create-contract-finance-duration-select";
import CreateContractFinancePaymentMethodSelect from "@/features/create-contract/components/create-contract-finance-payment-method-select";
import CreateContractFinancePermissionsSection from "@/features/create-contract/components/create-contract-finance-permissions-section";
import CreateContractRentAmountField from "@/features/create-contract/components/create-contract-rent-amount-field";
import { useContractPeriods } from "@/features/create-contract/hooks/use-contract-periods";
import { usePaymentTypes } from "@/features/create-contract/hooks/use-payment-types";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { toPropertyContractType } from "@/features/create-contract/types/contract-type";
import type { FinanceDataState } from "@/features/create-contract/types/finance-step";
import { getDocFeeLinesFromStep6 } from "@/features/create-contract/utils/build-finance-data-from-step6";
import { parseContractPeriodLabel } from "@/features/create-contract/utils/parse-contract-period-label";

type CreateContractFinanceDataPhaseProps = {
  labels: CreateContractLabels["finance"];
  contractType: ContractTypeId;
  value: FinanceDataState;
  onChange: (value: FinanceDataState) => void;
  showFieldErrors?: boolean;
};

export default function CreateContractFinanceDataPhase({
  labels,
  contractType,
  value,
  onChange,
  showFieldErrors = false,
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
    ...(contractPeriodsQuery.data ?? []).map((period) => {
      const parsed = parseContractPeriodLabel(period.period);

      return {
        value: String(period.id),
        title: parsed.title,
        fee: parsed.fee,
        feeLabel: parsed.fee
          ? labels.contractDuration.feeLabel
          : undefined,
      };
    }),
    {
      value: CUSTOM_CONTRACT_DURATION_VALUE,
      title: labels.contractDuration.otherOption,
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
      title: paymentType.name,
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

  const durationValue = value.isCustomDuration
    ? CUSTOM_CONTRACT_DURATION_VALUE
    : value.contractPeriodId === ""
      ? ""
      : String(value.contractPeriodId);
  const durationInvalid =
    showFieldErrors &&
    (value.isCustomDuration
      ? !(
          typeof value.customDurationYears === "number" &&
          value.customDurationYears >= 1 &&
          typeof value.customDurationMonths === "number"
        )
      : value.contractPeriodId === "");
  const rentInvalid =
    showFieldErrors &&
    (value.totalRentAmount.replace(/\D/g, "").length === 0 ||
      Number(value.totalRentAmount.replace(/\D/g, "")) <= 0);
  const paymentInvalid = showFieldErrors && value.paymentTypeId === "";
  const rentValid =
    !rentInvalid &&
    value.totalRentAmount.replace(/\D/g, "").length > 0 &&
    Number(value.totalRentAmount.replace(/\D/g, "")) > 0;

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
          value={durationValue}
          note={selectedPeriodNote}
          currencyLabel={labels.contractDuration.currency}
          disabled={contractPeriodsQuery.isLoading}
          invalid={durationInvalid}
          onChange={handleDurationChange}
        />

        {value.isCustomDuration ? (
          <div className="rounded-2xl border border-[#e8e8e8] bg-brand-background/40 p-4">
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
          </div>
        ) : null}
      </div>

      {contractPeriodsQuery.error ? (
        <p className="text-sm text-destructive">
          {labels.contractDuration.optionsError}
        </p>
      ) : null}

      <CreateContractRentAmountField
        label={labels.totalRentAmount.label}
        placeholder={labels.totalRentAmount.placeholder}
        currency={labels.contractDuration.currency}
        value={value.totalRentAmount}
        onChange={(totalRentAmount) =>
          updateField("totalRentAmount", totalRentAmount)
        }
        invalid={rentInvalid}
        valid={rentValid}
      />

      <CreateContractFinancePaymentMethodSelect
        label={labels.paymentMethod.label}
        options={paymentTypeOptions}
        value={value.paymentTypeId === "" ? "" : String(value.paymentTypeId)}
        note={selectedPaymentTypeNotes}
        disabled={paymentTypesQuery.isLoading}
        invalid={paymentInvalid}
        onChange={(paymentTypeId) =>
          updateField("paymentTypeId", Number(paymentTypeId))
        }
      />

      {paymentTypesQuery.error ? (
        <p className="text-sm text-destructive">
          {labels.paymentMethod.optionsError}
        </p>
      ) : null}

      <div className="space-y-4 pt-2">
        <CreateContractFinancePermissionsSection
          labels={labels.tenantPermissions}
          value={value.selectedTenantRoleIds}
          values={value.tenantRoleValues}
          onChange={({ selectedTenantRoleIds, tenantRoleValues }) =>
            onChange({
              ...value,
              selectedTenantRoleIds,
              tenantRoleValues,
              addTenantPermissions: selectedTenantRoleIds.length > 0,
            })
          }
        />

        <CreateContractFinanceConditionsSection
          labels={labels.otherConditions}
          enabled={value.addOtherConditions}
          value={value.otherConditionsList}
          onEnabledChange={(addOtherConditions) =>
            onChange({
              ...value,
              addOtherConditions,
              otherConditionsList:
                addOtherConditions && value.otherConditionsList.length === 0
                  ? [""]
                  : value.otherConditionsList,
            })
          }
          onChange={(otherConditionsList) =>
            onChange({
              ...value,
              otherConditionsList,
              addOtherConditions:
                otherConditionsList.some((item) => item.trim() !== "") ||
                otherConditionsList.length > 0,
            })
          }
        />
      </div>
    </div>
  );
}
