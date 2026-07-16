"use client";

import CreateContractFinancialBreakdown from "@/features/create-contract/components/create-contract-financial-breakdown";
import { useContractFinanceSummary } from "@/features/create-contract/hooks/use-contract-finance-summary";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

type CreateContractPaymentSummaryProps = {
  labels: CreateContractLabels["payment"]["summary"];
  contractType: ContractTypeId;
};

export default function CreateContractPaymentSummary({
  labels,
  contractType,
}: CreateContractPaymentSummaryProps) {
  const contractUuid = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.uuid ??
      state.contractStep1Data?.uuid ??
      null,
  );
  const { data, isLoading } = useContractFinanceSummary(contractUuid);

  return (
    <CreateContractFinancialBreakdown
      labels={labels}
      contractType={contractType}
      data={data}
      isLoading={isLoading}
    />
  );
}
