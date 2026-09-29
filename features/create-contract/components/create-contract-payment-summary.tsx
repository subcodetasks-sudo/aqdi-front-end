"use client";

import CreateContractFinancialBreakdown from "@/features/create-contract/components/create-contract-financial-breakdown";
import { useContractFinanceSummary } from "@/features/create-contract/hooks/use-contract-finance-summary";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { AppliedContractCoupon } from "@/features/create-contract/types/contract-coupon";
import { deedTypeIsPaper } from "@/features/create-contract/types/deed-type";
import { mapInstrumentTypeToDeedType } from "@/features/create-contract/utils/map-instrument-type-to-deed-type";

type CreateContractPaymentSummaryProps = {
  labels: CreateContractLabels["payment"]["summary"];
  appliedCoupon?: AppliedContractCoupon | null;
};

export default function CreateContractPaymentSummary({
  labels,
  appliedCoupon = null,
}: CreateContractPaymentSummaryProps) {
  const contractUuid = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.uuid ??
      state.contractStep1Data?.uuid ??
      null,
  );
  const cachedSummary = useCreateContractDraftStore(
    (state) => state.contractFinanceSummaryData ?? state.contractFinancialData,
  );
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const instrumentType = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.instrument_type,
  );
  const showPaperDeedFee =
    deedTypeIsPaper(selectedDeedType) ||
    deedTypeIsPaper(mapInstrumentTypeToDeedType(instrumentType));
  const { data, isLoading } = useContractFinanceSummary(contractUuid);

  return (
    <CreateContractFinancialBreakdown
      labels={labels}
      data={data ?? cachedSummary ?? undefined}
      isLoading={isLoading && !cachedSummary}
      appliedCoupon={appliedCoupon}
      sectionTitle={labels.sectionTitle}
      showPaperDeedFee={showPaperDeedFee}
    />
  );
}
