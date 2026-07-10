"use client";

import { useRouter } from "next/navigation";

import CreateContractAgentDataPhase from "@/features/create-contract/components/create-contract-agent-data-phase";
import CreateContractCancelRequestButton from "@/features/create-contract/components/create-contract-cancel-request-button";
import CreateContractOwnerDataPhase from "@/features/create-contract/components/create-contract-owner-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import { useCreateContractOwnerStep } from "@/features/create-contract/hooks/use-create-contract-owner-step";
import { useSaveContractDraft } from "@/features/create-contract/hooks/use-save-contract-draft";
import { useSubmitContractStep3 } from "@/features/create-contract/hooks/use-submit-contract-step3";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";
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
  const router = useRouter();
  const { submitStep3, isSubmitting } = useSubmitContractStep3();
  const { saveDraft, isSaving: isSavingDraft } = useSaveContractDraft();
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const isFirstPhaseEmpty = currentPhaseIndex === 0 && ownerData.fullName === "";

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

  async function handleSaveLater() {
    if (isSavingDraft) {
      return;
    }

    const result = await saveDraft();

    if (!result) {
      return;
    }

    // Clear the local draft + localStorage and send the user back home.
    resetCreateContractDraft();
    router.push("/");
  }

  return (
    <div className="space-y-4">
      <CreateContractStepPhaseProgress
        totalPhases={phaseCount}
        currentPhaseIndex={currentPhaseIndex}
      />

      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        {isFirstPhaseEmpty && contractSession ? (
          <div className="mb-4 flex justify-end">
            <CreateContractCancelRequestButton
              contractId={contractSession.contractId}
              label={labels.cancelRequest}
            />
          </div>
        ) : null}

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
        saveLaterLabel={
          isFirstPhaseEmpty
            ? isSavingDraft
              ? labels.navigation.savingLater
              : labels.navigation.saveLater
            : undefined
        }
        canContinue={canContinue && !isSubmitting}
        onPrevious={handlePrevious}
        onContinue={() => void handleContinue()}
        onSaveLater={isFirstPhaseEmpty ? () => void handleSaveLater() : undefined}
      />
    </div>
  );
}
