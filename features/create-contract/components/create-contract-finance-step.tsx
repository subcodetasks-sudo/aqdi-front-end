"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractFinanceDataPhase from "@/features/create-contract/components/create-contract-finance-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import { useSubmitContractStep6 } from "@/features/create-contract/hooks/use-submit-contract-step6";
import { useCreateContractFinanceStep } from "@/features/create-contract/hooks/use-create-contract-finance-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { sanitizeFinanceDataForContinue } from "@/features/create-contract/types/finance-step";
import { isSubleaseContract } from "@/features/create-contract/utils/is-sublease-contract";
import { scrollToFirstInvalidField } from "@/features/shared/utils/scroll-to-first-invalid-field";

type CreateContractFinanceStepProps = {
  labels: CreateContractLabels["finance"];
  contractType: ContractTypeId;
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractFinanceStep({
  labels,
  contractType,
  onBack,
  onComplete,
}: CreateContractFinanceStepProps) {
  const tIncomplete = useTranslations("createContract");
  const tSubleaseAlert = useTranslations("createContract.finance.subleaseAlert");
  const { financeData, setFinanceData, canContinue } =
    useCreateContractFinanceStep();
  const { submitStep6, isSubmitting } = useSubmitContractStep6();
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const instrumentType = useCreateContractDraftStore(
    (state) => state.contractStep1Data?.instrument_type,
  );
  const isSublease = isSubleaseContract({ selectedDeedType, instrumentType });

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    const nextFinanceData = sanitizeFinanceDataForContinue(financeData);

    if (
      nextFinanceData.addOtherConditions !== financeData.addOtherConditions ||
      nextFinanceData.selectedTenantRoleIds.length !==
        financeData.selectedTenantRoleIds.length ||
      nextFinanceData.otherConditionsList.length !==
        financeData.otherConditionsList.length
    ) {
      setFinanceData(nextFinanceData);
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(tIncomplete("incompleteContinue"));
      setTimeout(scrollToFirstInvalidField, 0);
      return;
    }

    const submitted = await submitStep6({ financeData: nextFinanceData });

    if (!submitted) {
      return;
    }

    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="p-6 md:p-8">
        <CreateContractStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
        />

        {isSublease ? (
          <div
            role="note"
            className="mb-8 flex items-start gap-3 rounded-xl border border-[#bfd4ff] bg-[#edf5ff] px-4 py-3 text-[#2f6fed]"
          >
            <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-relaxed">
              <span className="font-bold">{tSubleaseAlert("title")}</span>{" "}
              {tSubleaseAlert("bodyBefore")}{" "}
              <span className="font-bold">{tSubleaseAlert("duration")}</span>{" "}
              {tSubleaseAlert("bodyMiddle")}{" "}
              <span className="font-bold">{tSubleaseAlert("startDate")}</span>{" "}
              {tSubleaseAlert("bodyAfter")}
            </p>
          </div>
        ) : null}

        <CreateContractFinanceDataPhase
          labels={labels}
          contractType={contractType}
          value={financeData}
          onChange={setFinanceData}
          showFieldErrors={showFieldErrors}
        />

        <CreateContractStepNavigation
          previousLabel={labels.navigation.previous}
          continueLabel={
            isSubmitting
              ? labels.navigation.submitting
              : labels.navigation.continue
          }
          isSubmitting={isSubmitting}
          onPrevious={onBack}
          onContinue={() => void handleContinue()}
        />
      </div>
    </div>
  );
}
