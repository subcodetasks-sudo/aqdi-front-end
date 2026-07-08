"use client";

import { useRouter } from "next/navigation";

import CreateContractCancelRequestButton from "@/features/create-contract/components/create-contract-cancel-request-button";
import CreateContractRentedUnitDataPhase from "@/features/create-contract/components/create-contract-rented-unit-data-phase";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import CreateContractTenantIndividualDataPhase from "@/features/create-contract/components/create-contract-tenant-individual-data-phase";
import CreateContractTenantOrganizationDataPhase from "@/features/create-contract/components/create-contract-tenant-organization-data-phase";
import CreateContractTenantStatusSelect from "@/features/create-contract/components/create-contract-tenant-status-select";
import { useCreateContractTenantStep } from "@/features/create-contract/hooks/use-create-contract-tenant-step";
import { useSaveContractDraft } from "@/features/create-contract/hooks/use-save-contract-draft";
import { useSubmitContractStep4 } from "@/features/create-contract/hooks/use-submit-contract-step4";
import { useSubmitContractStep5 } from "@/features/create-contract/hooks/use-submit-contract-step5";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";
import { TENANT_STEP_PHASE_COUNT } from "@/features/create-contract/types/rented-unit-step";
import { isOrganizationTenantStatus } from "@/features/create-contract/types/tenant-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { toPropertyContractType } from "@/features/create-contract/types/contract-type";

type CreateContractTenantStepProps = {
  labels: CreateContractLabels["tenant"];
  contractType: ContractTypeId;
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractTenantStep({
  labels,
  contractType,
  onBack,
  onComplete,
}: CreateContractTenantStepProps) {
  const {
    currentPhaseIndex,
    tenantData,
    setTenantData,
    rentedUnitData,
    setRentedUnitData,
    updateStatus,
    canContinue,
    isLastPhase,
    goToNextPhase,
    goToPreviousPhase,
  } = useCreateContractTenantStep();
  const router = useRouter();
  const { submitStep4, isSubmitting: isSubmittingStep4 } = useSubmitContractStep4();
  const { submitStep5, isSubmitting: isSubmittingStep5 } = useSubmitContractStep5();
  const { saveDraft, isSaving: isSavingDraft } = useSaveContractDraft();
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const apiContractType = toPropertyContractType(contractType);
  const isSubmitting = isSubmittingStep4 || isSubmittingStep5;

  const phase = labels.phases[currentPhaseIndex];
  const isTenantDataPhase = currentPhaseIndex === 0;
  const isRentedUnitPhase = currentPhaseIndex === 1;

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

    if (isTenantDataPhase) {
      const submitted = await submitStep4({ tenantData });

      if (!submitted) {
        return;
      }
    }

    if (isRentedUnitPhase) {
      const submitted = await submitStep5({
        contractType: apiContractType,
        rentedUnitData,
      });

      if (!submitted) {
        return;
      }
    }

    if (isLastPhase) {
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
        totalPhases={TENANT_STEP_PHASE_COUNT}
        currentPhaseIndex={currentPhaseIndex}
      />

      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        {currentPhaseIndex === 0 && tenantData.status === "" && contractSession ? (
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
          icon={currentPhaseIndex === 0 ? "user" : "building"}
        />

        {currentPhaseIndex === 0 ? (
          <>
            <CreateContractTenantStatusSelect
              labels={labels.tenantStatus}
              value={tenantData.status}
              onChange={updateStatus}
            />

            {tenantData.status === "individual" ? (
              <CreateContractTenantIndividualDataPhase
                labels={labels.individualData}
                birthDateLabels={labels.birthDate}
                value={tenantData.individual}
                onChange={(individual) =>
                  setTenantData({ ...tenantData, individual })
                }
              />
            ) : null}

            {isOrganizationTenantStatus(tenantData.status) ? (
              <CreateContractTenantOrganizationDataPhase
                labels={labels.organizationData}
                birthDateLabels={labels.birthDate}
                value={tenantData.organization}
                onChange={(organization) =>
                  setTenantData({ ...tenantData, organization })
                }
              />
            ) : null}
          </>
        ) : null}

        {currentPhaseIndex === 1 ? (
          <CreateContractRentedUnitDataPhase
            labels={labels.rentedUnit}
            value={rentedUnitData}
            onChange={setRentedUnitData}
          />
        ) : null}
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        saveLaterLabel={
          currentPhaseIndex === 0 && tenantData.status === ""
            ? isSavingDraft
              ? labels.navigation.savingLater
              : labels.navigation.saveLater
            : undefined
        }
        canContinue={canContinue && !isSubmitting}
        onPrevious={handlePrevious}
        onContinue={() => void handleContinue()}
        onSaveLater={
          currentPhaseIndex === 0 && tenantData.status === ""
            ? () => void handleSaveLater()
            : undefined
        }
      />
    </div>
  );
}
