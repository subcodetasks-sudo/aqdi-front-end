"use client";

import CreateContractFinancialBreakdown from "@/features/create-contract/components/create-contract-financial-breakdown";
import { useContractFinanceSummary } from "@/features/create-contract/hooks/use-contract-finance-summary";
import { useContractPeriods } from "@/features/create-contract/hooks/use-contract-periods";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { AppliedContractCoupon } from "@/features/create-contract/types/contract-coupon";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { toPropertyContractType } from "@/features/create-contract/types/contract-type";
import { parseContractPeriodLabel } from "@/features/create-contract/utils/parse-contract-period-label";

type CreateContractPaymentSummaryProps = {
  labels: CreateContractLabels["payment"]["summary"];
  contractType: ContractTypeId;
  appliedCoupon?: AppliedContractCoupon | null;
};

function withTemplate(template: string, count: number) {
  return template.replaceAll("{count}", String(count));
}

export default function CreateContractPaymentSummary({
  labels,
  contractType,
  appliedCoupon = null,
}: CreateContractPaymentSummaryProps) {
  const contractUuid = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.uuid ??
      state.contractStep1Data?.uuid ??
      null,
  );
  const financeData = useCreateContractDraftStore((state) => state.financeData);
  const { data, isLoading } = useContractFinanceSummary(contractUuid);
  const contractPeriodsQuery = useContractPeriods(
    toPropertyContractType(contractType),
  );

  const contractTypeLabel =
    contractType === "commercial"
      ? labels.contractTypeCommercial
      : labels.contractTypeResidential;

  const durationLabel = financeData.isCustomDuration
    ? [
        financeData.customDurationYears !== "" && financeData.customDurationYears > 0
          ? withTemplate(labels.yearsCount, financeData.customDurationYears)
          : null,
        financeData.customDurationMonths !== "" && financeData.customDurationMonths > 0
          ? withTemplate(labels.monthsCount, financeData.customDurationMonths)
          : null,
      ]
        .filter((part): part is string => Boolean(part))
        .join(" ")
    : parseContractPeriodLabel(
        (contractPeriodsQuery.data ?? []).find(
          (period) => period.id === financeData.contractPeriodId,
        )?.period ?? "",
      ).title;

  const feeSubtitle = [contractTypeLabel, durationLabel || null]
    .filter((part): part is string => Boolean(part))
    .join(" - ");

  return (
    <CreateContractFinancialBreakdown
      labels={labels}
      contractType={contractType}
      data={data}
      isLoading={isLoading}
      appliedCoupon={appliedCoupon}
      sectionTitle={labels.sectionTitle}
      feeSubtitle={feeSubtitle}
    />
  );
}
