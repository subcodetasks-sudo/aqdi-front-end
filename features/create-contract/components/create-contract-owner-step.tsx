"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractAgentDataPhase from "@/features/create-contract/components/create-contract-agent-data-phase";
import CreateContractOwnerDataPhase from "@/features/create-contract/components/create-contract-owner-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import { useCreateContractDeedStep } from "@/features/create-contract/hooks/use-create-contract-deed-step";
import { useCreateContractOwnerStep } from "@/features/create-contract/hooks/use-create-contract-owner-step";
import { useSubmitContractStep2 } from "@/features/create-contract/hooks/use-submit-contract-step2";
import { useSubmitContractStep3 } from "@/features/create-contract/hooks/use-submit-contract-step3";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { EMPTY_OWNER_DATA } from "@/features/create-contract/types/owner-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { scrollToFirstInvalidField } from "@/features/shared/utils/scroll-to-first-invalid-field";

type CreateContractOwnerStepProps = {
  labels: CreateContractLabels["owner"];
  legalAgentLabels: CreateContractLabels["deed"]["legalAgent"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractOwnerStep({
  labels,
  legalAgentLabels,
  onBack,
  onComplete,
}: CreateContractOwnerStepProps) {
  const t = useTranslations("createContract");
  const deedOwnerIsDeceased = useCreateContractDraftStore(
    (state) => state.deed.deedOwnerIsDeceased,
  );
  const {
    ownerData,
    setOwnerData,
    agentData,
    setAgentData,
    canContinue,
    agentOnly: hookAgentOnly,
    existingLegalAgentPoaUrl,
    documentAlreadyAttached,
  } = useCreateContractOwnerStep();
  const agentOnly = hookAgentOnly || deedOwnerIsDeceased;
  const {
    nationalAddressMethod,
    nationalAddressPhotoFiles,
    nationalAddressLinkUrl,
    nationalAddressManual,
  } = useCreateContractDeedStep();
  const { submitStep2, isSubmitting: isSubmittingStep2 } = useSubmitContractStep2();
  const { submitStep3, isSubmitting: isSubmittingStep3 } = useSubmitContractStep3();
  const isSubmitting = isSubmittingStep2 || isSubmittingStep3;
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const setActiveStepSaveHandler = useCreateContractDraftStore(
    (state) => state.setActiveStepSaveHandler,
  );

  const phase = labels.phases[0];
  const showAgentForm = agentOnly || ownerData.hasAgent === "yes";
  const phaseTitle = agentOnly ? legalAgentLabels.title : phase.title;
  const phaseSubtitle = agentOnly ? legalAgentLabels.subtitle : phase.subtitle;
  const agentFormLabels = agentOnly
    ? legalAgentLabels.agentData
    : labels.agentData;
  const agentBirthDateLabels = agentOnly
    ? legalAgentLabels.birthDate
    : labels.birthDate;
  const agentValidationLabels = agentOnly
    ? legalAgentLabels.validation.fieldErrors
    : labels.validation.fieldErrors;

  async function submitOwnerStep(): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(t("incompleteContinue"));
      setTimeout(scrollToFirstInvalidField, 0);
      return false;
    }

    if (agentOnly) {
      if (!nationalAddressMethod) {
        toast.error(t("incompleteContinue"));
        return false;
      }

      const submittedAddress = await submitStep2({
        addressMethod: nationalAddressMethod,
        photoFiles: nationalAddressPhotoFiles,
        linkUrl: nationalAddressLinkUrl,
        manualAddress: nationalAddressManual,
        legalAgent: agentData,
        hasExistingLegalAgentPoa: documentAlreadyAttached,
      });

      if (!submittedAddress) {
        return false;
      }

      return submitStep3({
        ownerData: EMPTY_OWNER_DATA,
        agentData,
        legalAgentOnly: true,
      });
    }

    return submitStep3({
      ownerData,
      agentData,
    });
  }

  async function handleContinue() {
    const submitted = await submitOwnerStep();

    if (!submitted) {
      return;
    }

    onComplete();
  }

  useEffect(() => {
    setActiveStepSaveHandler(submitOwnerStep);
    return () => setActiveStepSaveHandler(null);
  });

  return (
    <div className="space-y-4">
      <div className="p-3 md:p-5">
        <CreateContractStepPhaseHeader
          title={phaseTitle}
          subtitle={phaseSubtitle}
        />

        <div className="space-y-3">
          {!agentOnly ? (
            <CreateContractOwnerDataPhase
              labels={labels.ownerData}
              birthDateLabels={labels.birthDate}
              validationLabels={labels.validation.fieldErrors}
              value={ownerData}
              onChange={setOwnerData}
              showFieldErrors={showFieldErrors}
            />
          ) : null}

          {showAgentForm ? (
            <CreateContractAgentDataPhase
              labels={agentFormLabels}
              birthDateLabels={agentBirthDateLabels}
              validationLabels={agentValidationLabels}
              value={agentData}
              onChange={setAgentData}
              showFieldErrors={showFieldErrors}
              hideSectionHeader={agentOnly}
              existingPoaUrl={agentOnly ? existingLegalAgentPoaUrl : null}
              documentAlreadyAttached={agentOnly && documentAlreadyAttached}
              documentHint={agentOnly ? legalAgentLabels.documentHint : undefined}
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
