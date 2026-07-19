"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractAgentDataPhase from "@/features/create-contract/components/create-contract-agent-data-phase";
import CreateContractOwnerDataPhase from "@/features/create-contract/components/create-contract-owner-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
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
  const t = useTranslations("createContract");
  const {
    ownerData,
    setOwnerData,
    agentData,
    setAgentData,
    canContinue,
  } = useCreateContractOwnerStep();
  const { submitStep3, isSubmitting } = useSubmitContractStep3();

  const phase = labels.phases[0];
  const showAgentForm = ownerData.hasAgent === "yes";

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      toast.error(t("incompleteContinue"));
      return;
    }

    const submitted = await submitStep3({ ownerData, agentData });

    if (!submitted) {
      return;
    }

    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateContractStepPhaseHeader
          title={phase.title}
          subtitle={phase.subtitle}
          icon="id-card"
        />

        <div className="space-y-5">
          <CreateContractOwnerDataPhase
            labels={labels.ownerData}
            birthDateLabels={labels.birthDate}
            validationLabels={labels.validation.fieldErrors}
            value={ownerData}
            onChange={setOwnerData}
          />

          {showAgentForm ? (
            <CreateContractAgentDataPhase
              labels={labels.agentData}
              birthDateLabels={labels.birthDate}
              value={agentData}
              onChange={setAgentData}
            />
          ) : null}
        </div>
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        isSubmitting={isSubmitting}
        onPrevious={onBack}
        onContinue={() => void handleContinue()}
      />
    </div>
  );
}
