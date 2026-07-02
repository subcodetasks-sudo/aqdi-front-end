"use client";

import CreateContractAgentDataPhase from "@/features/create-contract/components/create-contract-agent-data-phase";
import CreateContractOwnerDataPhase from "@/features/create-contract/components/create-contract-owner-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import { useCreateContractOwnerStep } from "@/features/create-contract/hooks/use-create-contract-owner-step";
import { useSubmitContractStep3 } from "@/features/create-contract/hooks/use-submit-contract-step3";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractOwnerStepProps = {
  labels: CreateContractLabels["owner"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractOwnerStep({
  labels,
  onBack,
  onComplete,
}: CreateContractOwnerStepProps) {
  const {
    currentPhaseIndex,
    ownerData,
    setOwnerData,
    agentData,
    setAgentData,
    phaseCount,
    isLastPhase,
    canContinue,
    goToNextPhase,
    goToPreviousPhase,
  } = useCreateContractOwnerStep();
  const { submitStep3, isSubmitting } = useSubmitContractStep3();

  const phase = labels.phases[currentPhaseIndex];

  function handlePrevious() {
    if (currentPhaseIndex === 0) {
      onBack();
      return;
    }

    goToPreviousPhase();
  }

  async function handleContinue() {
    if (!canContinue || isSubmitting) {
      return;
    }

    if (isLastPhase) {
      const submitted = await submitStep3({ ownerData, agentData });

      if (!submitted) {
        return;
      }

      onComplete();
      return;
    }

    goToNextPhase();
  }

  return (
    <div className="space-y-4">
      <CreateContractStepPhaseProgress
        totalPhases={phaseCount}
        currentPhaseIndex={currentPhaseIndex}
      />

      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateContractStepPhaseHeader
          title={phase.title}
          subtitle={phase.subtitle}
          icon="id-card"
        />

        {currentPhaseIndex === 0 ? (
          <CreateContractOwnerDataPhase
            labels={labels.ownerData}
            birthDateLabels={labels.birthDate}
            validationLabels={labels.validation.fieldErrors}
            value={ownerData}
            onChange={setOwnerData}
          />
        ) : null}

        {currentPhaseIndex === 1 ? (
          <CreateContractAgentDataPhase
            labels={labels.agentData}
            birthDateLabels={labels.birthDate}
            value={agentData}
            onChange={setAgentData}
          />
        ) : null}
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        canContinue={canContinue && !isSubmitting}
        onPrevious={handlePrevious}
        onContinue={() => void handleContinue()}
      />
    </div>
  );
}
