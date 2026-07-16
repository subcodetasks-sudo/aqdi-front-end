"use client";

import CreateContractFinancialBreakdown from "@/features/create-contract/components/create-contract-financial-breakdown";
import { useContractFinancial } from "@/features/create-contract/hooks/use-contract-financial";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

type CreateContractFinanceFinancialSummaryProps = {
  labels: CreateContractLabels["payment"]["summary"];
  contractType: ContractTypeId;
};

export default function CreateContractFinanceFinancialSummary({
  labels,
  contractType,
}: CreateContractFinanceFinancialSummaryProps) {
  const contractUuid = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.uuid ??
      state.contractStep1Data?.uuid ??
      null,
  );
  const { data, isLoading } = useContractFinancial(contractUuid);

  return (
    <CreateContractFinancialBreakdown
      labels={labels}
      contractType={contractType}
      data={data}
      isLoading={isLoading}
    />
  );
}
