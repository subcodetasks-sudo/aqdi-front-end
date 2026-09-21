"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractAgentDataPhase from "@/features/create-contract/components/create-contract-agent-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import { useCreateContractDeedStep } from "@/features/create-contract/hooks/use-create-contract-deed-step";
import { useSubmitContractStep2 } from "@/features/create-contract/hooks/use-submit-contract-step2";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { isLegalAgentDataComplete } from "@/features/create-contract/utils/is-legal-agent-data-complete";
import { scrollToFirstInvalidField } from "@/features/shared/utils/scroll-to-first-invalid-field";

type CreateContractWaqfNazirStepProps = {
  labels: CreateContractLabels["deed"]["waqfNazir"];
  navigationLabels: CreateContractLabels["deed"]["navigation"];
  onBack: () => void;
};

export default function CreateContractWaqfNazirStep({
  labels,
  navigationLabels,
  onBack,
}: CreateContractWaqfNazirStepProps) {
  const tIncomplete = useTranslations("createContract");
  const {
    agentData,
    setAgentData,
    existingWaqfNazirDocumentUrl,
    existingTrusteeshipImageUrl,
    deedTrusteeshipFiles,
    deedGuardiansPoaFiles,
    nationalAddressMethod,
    nationalAddressPhotoFiles,
    nationalAddressLinkUrl,
    nationalAddressManual,
  } = useCreateContractDeedStep();
  const { submitStep2, isSubmitting } = useSubmitContractStep2();
  const skipOwnerToTenant = useCreateContractDraftStore(
    (state) => state.skipOwnerToTenant,
  );
  const setActiveStepSaveHandler = useCreateContractDraftStore(
    (state) => state.setActiveStepSaveHandler,
  );
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const documentAlreadyAttached =
    Boolean(existingWaqfNazirDocumentUrl) ||
    Boolean(existingTrusteeshipImageUrl) ||
    deedTrusteeshipFiles.length > 0 ||
    deedGuardiansPoaFiles.length > 0;

  const canContinue = isLegalAgentDataComplete(agentData, {
    hasExistingPoa: documentAlreadyAttached,
  });

  async function submitNazirStep2(): Promise<boolean> {
    if (!nationalAddressMethod) {
      toast.error(tIncomplete("incompleteContinue"));
      return false;
    }

    return submitStep2({
      addressMethod: nationalAddressMethod,
      photoFiles: nationalAddressPhotoFiles,
      linkUrl: nationalAddressLinkUrl,
      manualAddress: nationalAddressManual,
      waqfNazir: agentData,
      hasExistingWaqfNazirDocument: documentAlreadyAttached,
    });
  }

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(tIncomplete("incompleteContinue"));
      setTimeout(scrollToFirstInvalidField, 0);
      return;
    }

    const submitted = await submitNazirStep2();
    if (!submitted) {
      return;
    }

    // Owner step is hidden for endowment — jump straight to tenant.
    skipOwnerToTenant();
  }

  async function submitActiveNazirData(): Promise<boolean> {
    if (isSubmitting) {
      return false;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(tIncomplete("incompleteContinue"));
      setTimeout(scrollToFirstInvalidField, 0);
      return false;
    }

    return submitNazirStep2();
  }

  useEffect(() => {
    setActiveStepSaveHandler(submitActiveNazirData);
    return () => setActiveStepSaveHandler(null);
  });

  return (
    <div className="space-y-4">
      <div className="p-3 md:p-5">
        <CreateContractStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
        />

        <div className="space-y-3 rounded-[24px] bg-white p-3 md:p-4 dark:bg-transparent">
          <CreateContractAgentDataPhase
            labels={labels.agentData}
            birthDateLabels={labels.birthDate}
            validationLabels={labels.validation.fieldErrors}
            value={agentData}
            onChange={setAgentData}
            showFieldErrors={showFieldErrors}
            hideSectionHeader
            existingPoaUrl={
              existingWaqfNazirDocumentUrl ?? existingTrusteeshipImageUrl
            }
            documentAlreadyAttached={documentAlreadyAttached}
            documentHint={labels.documentHint}
          />
        </div>

        <CreateContractStepNavigation
          previousLabel={navigationLabels.previous}
          continueLabel={
            isSubmitting
              ? navigationLabels.submitting
              : navigationLabels.continue
          }
          isSubmitting={isSubmitting}
          onPrevious={onBack}
          onContinue={() => void handleContinue()}
        />
      </div>
    </div>
  );
}
