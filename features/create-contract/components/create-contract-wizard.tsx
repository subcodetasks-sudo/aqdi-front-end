"use client";

import { useEffect } from "react";

import CreateContractDeedStep from "@/features/create-contract/components/create-contract-deed-step";
import CreateContractFinanceStep from "@/features/create-contract/components/create-contract-finance-step";
import CreateContractHeader from "@/features/create-contract/components/create-contract-header";
import CreateContractIntroStep from "@/features/create-contract/components/create-contract-intro-step";
import CreateContractOwnerStep from "@/features/create-contract/components/create-contract-owner-step";
import CreateContractPaymentStep from "@/features/create-contract/components/create-contract-payment-step";
import CreateContractTenantStep from "@/features/create-contract/components/create-contract-tenant-step";
import CreateContractStepper from "@/features/create-contract/components/create-contract-stepper";
import { useCreateContractSteps } from "@/features/create-contract/hooks/use-create-contract-steps";
import { useStartFreshContract } from "@/features/create-contract/hooks/use-start-fresh-contract";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";
import CreateFlowDraftHydrator from "@/features/shared/components/create-flow-draft-hydrator";

type CreateContractWizardProps = {
  labels: CreateContractLabels;
  contractType: ContractTypeId;
};

export default function CreateContractWizard({
  labels,
  contractType,
}: CreateContractWizardProps) {
  const { currentStep, goNext, goBack } = useCreateContractSteps();
  const { handleStart, isStarting } = useStartFreshContract(contractType);
  const hydrateFilesFromPersisted = useCreateContractDraftStore(
    (state) => state.hydrateFilesFromPersisted,
  );
  const pageTitle =
    contractType === "residential"
      ? labels.pageTitleResidential
      : labels.pageTitleCommercial;

  useEffect(() => {
    return () => {
      const { currentStep } = useCreateContractDraftStore.getState();

      if (currentStep === "payment") {
        resetCreateContractDraft();
      }
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <CreateFlowDraftHydrator hydrate={hydrateFilesFromPersisted} />

      <CreateContractHeader pageTitle={pageTitle} labels={labels.header} />
      <CreateContractStepper labels={labels.stepper} />

      {currentStep === "intro" ? (
        <CreateContractIntroStep
          labels={labels.intro}
          stepperLabels={labels.stepper}
          contractType={contractType}
          prices={labels.prices}
          onStart={handleStart}
          isStarting={isStarting}
        />
      ) : null}

      {currentStep === "deed" ? (
        <CreateContractDeedStep
          labels={labels.deed}
          onBack={goBack}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "owner" ? (
        <CreateContractOwnerStep
          labels={labels.owner}
          onBack={goBack}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "tenant" ? (
        <CreateContractTenantStep
          labels={labels.tenant}
          contractType={contractType}
          onBack={goBack}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "finance" ? (
        <CreateContractFinanceStep
          labels={labels.finance}
          contractType={contractType}
          onBack={goBack}
          onComplete={goNext}
        />
      ) : null}

      {currentStep === "payment" ? (
        <CreateContractPaymentStep
          labels={labels.payment}
          saveLaterDialogLabels={labels.tenant.saveLaterDialog}
          contractType={contractType}
          onBack={goBack}
        />
      ) : null}
    </div>
  );
}
