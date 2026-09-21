"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractAgentDataPhase from "@/features/create-contract/components/create-contract-agent-data-phase";
import CreateContractOwnerDataPhase from "@/features/create-contract/components/create-contract-owner-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import { useCreateContractOwnerStep } from "@/features/create-contract/hooks/use-create-contract-owner-step";
import { useSubmitContractStep3 } from "@/features/create-contract/hooks/use-submit-contract-step3";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { isOwnerDataComplete } from "@/features/create-contract/types/owner-step";
import { requiresDeceasedOwnerLegalAgent } from "@/features/create-contract/utils/requires-deceased-owner-legal-agent";
import { scrollToFirstInvalidField } from "@/features/shared/utils/scroll-to-first-invalid-field";

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
    canContinue: baseCanContinue,
  } = useCreateContractOwnerStep();
  const { submitStep3, isSubmitting } = useSubmitContractStep3();
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const setActiveStepSaveHandler = useCreateContractDraftStore(
    (state) => state.setActiveStepSaveHandler,
  );
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const contractStep1Data = useCreateContractDraftStore(
    (state) => state.contractStep1Data,
  );
  const contractStep2Data = useCreateContractDraftStore(
    (state) => state.contractStep2Data,
  );
  const legalAgentAlreadySaved = requiresDeceasedOwnerLegalAgent({
    selectedDeedType,
    instrumentType: contractStep1Data?.instrument_type,
    requiresDeceasedOwnerLegalAgent:
      contractStep2Data?.requires_deceased_owner_legal_agent ??
      contractStep1Data?.requires_deceased_owner_legal_agent,
    propertyOwnerIsDeceased:
      contractStep2Data?.property_owner_is_deceased ??
      contractStep1Data?.property_owner_is_deceased,
  });

  // Legal agent was already collected on the deed step — do not require
  // agent fields here even if the draft still has hasAgent === "yes".
  const canContinue = legalAgentAlreadySaved
    ? isOwnerDataComplete({ ...ownerData, hasAgent: "no" })
    : baseCanContinue;

  const phase = labels.phases[0];
  const showAgentForm =
    !legalAgentAlreadySaved && ownerData.hasAgent === "yes";

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(t("incompleteContinue"));
      setTimeout(scrollToFirstInvalidField, 0);
      return;
    }

    const submitted = await submitStep3({
      ownerData: legalAgentAlreadySaved
        ? { ...ownerData, hasAgent: "no" }
        : ownerData,
      agentData,
      legalAgentAlreadySaved,
    });

    if (!submitted) {
      return;
    }

    onComplete();
  }

  async function submitActiveOwnerData(): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(t("incompleteContinue"));
      setTimeout(scrollToFirstInvalidField, 0);
      return false;
    }

    return submitStep3({
      ownerData: legalAgentAlreadySaved
        ? { ...ownerData, hasAgent: "no" }
        : ownerData,
      agentData,
      legalAgentAlreadySaved,
    });
  }

  useEffect(() => {
    setActiveStepSaveHandler(submitActiveOwnerData);
    return () => setActiveStepSaveHandler(null);
  });

  return (
    <div className="space-y-4">
      <div className="p-3 md:p-5">
        <CreateContractStepPhaseHeader
          title={phase.title}
          subtitle={phase.subtitle}
        />

        <div className="space-y-3">
          <CreateContractOwnerDataPhase
            labels={labels.ownerData}
            birthDateLabels={labels.birthDate}
            validationLabels={labels.validation.fieldErrors}
            value={
              legalAgentAlreadySaved
                ? { ...ownerData, hasAgent: "no" }
                : ownerData
            }
            onChange={(next) =>
              setOwnerData(
                legalAgentAlreadySaved
                  ? { ...next, hasAgent: "no" }
                  : next,
              )
            }
            showFieldErrors={showFieldErrors}
            hideHasAgent={legalAgentAlreadySaved}
          />

          {showAgentForm ? (
            <CreateContractAgentDataPhase
              labels={labels.agentData}
              birthDateLabels={labels.birthDate}
              validationLabels={labels.validation.fieldErrors}
              value={agentData}
              onChange={setAgentData}
              showFieldErrors={showFieldErrors}
            />
          ) : null}
        </div>

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
