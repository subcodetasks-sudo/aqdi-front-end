"use client";

import CreateContractDeedStep from "@/features/create-contract/components/create-contract-deed-step";
import CreateContractIntroStep from "@/features/create-contract/components/create-contract-intro-step";
import CreateContractOwnerStep from "@/features/create-contract/components/create-contract-owner-step";
import CreateContractTenantStep from "@/features/create-contract/components/create-contract-tenant-step";
import CreateContractStepper from "@/features/create-contract/components/create-contract-stepper";
import { useCreateContractSteps } from "@/features/create-contract/hooks/use-create-contract-steps";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

type CreateContractWizardProps = {
  labels: CreateContractLabels;
  contractType: ContractTypeId;
};

export default function CreateContractWizard({
  labels,
  contractType,
}: CreateContractWizardProps) {
  const { currentStep, currentStepIndex, goNext, goBack } =
    useCreateContractSteps();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <CreateContractStepper
        labels={labels.stepper}
        currentStepIndex={currentStepIndex}
      />

      {currentStep === "intro" ? (
        <CreateContractIntroStep
          labels={labels.intro}
          stepperLabels={labels.stepper}
          contractType={contractType}
          prices={labels.prices}
          onStart={goNext}
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
          onBack={goBack}
          onComplete={goNext}
        />
      ) : null}
    </div>
  );
}
