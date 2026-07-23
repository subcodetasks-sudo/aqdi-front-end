"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractBirthDateFields from "@/features/create-contract/components/create-contract-birth-date-fields";
import CreateContractCancelRequestButton from "@/features/create-contract/components/create-contract-cancel-request-button";
import CreateContractLeaseRenewalAmendmentsSection from "@/features/create-contract/components/create-contract-lease-renewal-amendments-section";
import CreateContractRentedUnitDataPhase from "@/features/create-contract/components/create-contract-rented-unit-data-phase";
import CreateContractSaveLaterDialog from "@/features/create-contract/components/create-contract-save-later-dialog";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import CreateContractTenantIndividualDataPhase from "@/features/create-contract/components/create-contract-tenant-individual-data-phase";
import CreateContractTenantOrganizationDataPhase from "@/features/create-contract/components/create-contract-tenant-organization-data-phase";
import CreateContractTenantStatusSelect from "@/features/create-contract/components/create-contract-tenant-status-select";
import {
  LEASE_RENEWAL_TENANT_PHASE_COUNT,
  useCreateContractTenantStep,
} from "@/features/create-contract/hooks/use-create-contract-tenant-step";
import { useSaveContractDraft } from "@/features/create-contract/hooks/use-save-contract-draft";
import { useSubmitContractStep4 } from "@/features/create-contract/hooks/use-submit-contract-step4";
import { useSubmitContractStep5 } from "@/features/create-contract/hooks/use-submit-contract-step5";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";
import { TENANT_STEP_PHASE_COUNT } from "@/features/create-contract/types/rented-unit-step";
import { isOrganizationTenantStatus } from "@/features/create-contract/types/tenant-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import { isAdultBirthDateComplete } from "@/lib/validation/birth-date-year-options";

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
  const tIncomplete = useTranslations("createContract");
  const {
    currentPhaseIndex,
    tenantData,
    setTenantData,
    rentedUnits,
    setRentedUnits,
    leaseRenewalAddNotes,
    leaseRenewalNotes,
    setLeaseRenewalAddNotes,
    setLeaseRenewalNotes,
    isLeaseRenewal,
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
  const isSubmitting = isSubmittingStep4 || isSubmittingStep5;
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [saveLaterDialogOpen, setSaveLaterDialogOpen] = useState(false);

  const phase = labels.phases[currentPhaseIndex];
  const isTenantDataPhase = currentPhaseIndex === 0;
  const isRentedUnitPhase = currentPhaseIndex === 1;
  const isLeaseRenewalBirthDatePhase = isLeaseRenewal && isTenantDataPhase;
  const isLeaseRenewalAmendmentsPhase = isLeaseRenewal && isRentedUnitPhase;

  const phaseTitle = isLeaseRenewalAmendmentsPhase
    ? labels.leaseRenewal.heading
    : phase.title;
  const phaseSubtitle = isLeaseRenewalAmendmentsPhase
    ? labels.leaseRenewal.subtitle
    : phase.subtitle;

  function handlePrevious() {
    if (currentPhaseIndex === 0) {
      onBack();
      return;
    }

    goToPreviousPhase();
  }

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(tIncomplete("incompleteContinue"));
      return;
    }

    setShowFieldErrors(false);

    if (isLeaseRenewalBirthDatePhase) {
      goToNextPhase();
      return;
    }

    if (isLeaseRenewalAmendmentsPhase) {
      const submitted = await submitStep4({
        tenantData,
        isLeaseRenewal: true,
        notes: leaseRenewalAddNotes ? leaseRenewalNotes : undefined,
      });

      if (!submitted) {
        return;
      }

      onComplete();
      return;
    }

    if (isTenantDataPhase) {
      const submitted = await submitStep4({
        tenantData,
        isLeaseRenewal: false,
      });

      if (!submitted) {
        return;
      }
    }

    if (isRentedUnitPhase) {
      const submitted = await submitStep5({
        rentedUnits,
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

  const showDraftActions = Boolean(contractSession) && !isLeaseRenewal;

  function handleOpenSaveLater() {
    if (isSavingDraft || isSubmitting) {
      return;
    }

    setSaveLaterDialogOpen(true);
  }

  async function handleConfirmSaveLater() {
    if (isSavingDraft || isSubmitting) {
      return;
    }

    const result = await saveDraft();

    if (!result.ok) {
      if (result.error === "missingContractSession") {
        toast.error(labels.missingContractSession);
        return;
      }

      toast.error(result.error || labels.saveLaterError);
      return;
    }

    setSaveLaterDialogOpen(false);
    resetCreateContractDraft();
    router.push("/requests");
  }

  return (
    <div className="space-y-4">
      <CreateContractStepPhaseProgress
        totalPhases={
          isLeaseRenewal ? LEASE_RENEWAL_TENANT_PHASE_COUNT : TENANT_STEP_PHASE_COUNT
        }
        currentPhaseIndex={currentPhaseIndex}
      />

      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        {showDraftActions && contractSession ? (
          <div className="mb-4 flex justify-end">
            <CreateContractCancelRequestButton
              contractId={contractSession.contractId}
              label={labels.cancelRequest}
            />
          </div>
        ) : null}

        <CreateContractStepPhaseHeader
          title={phaseTitle}
          subtitle={phaseSubtitle}
          icon={currentPhaseIndex === 0 ? "user" : "building"}
        />

        {isLeaseRenewalBirthDatePhase ? (
          <div className="rounded-3xl ">
            <CreateContractBirthDateFields
              labels={labels.birthDate}
              value={tenantData.individual.birthDate}
              onChange={(birthDate) =>
                setTenantData({
                  ...tenantData,
                  status: "individual",
                  individual: {
                    ...tenantData.individual,
                    birthDate,
                  },
                })
              }
              invalid={
                showFieldErrors &&
                !isAdultBirthDateComplete(tenantData.individual.birthDate)
              }
            />
          </div>
        ) : null}

        {isLeaseRenewalAmendmentsPhase ? (
          <CreateContractLeaseRenewalAmendmentsSection
            labels={labels.leaseRenewal}
            addNotes={leaseRenewalAddNotes}
            notes={leaseRenewalNotes}
            onAddNotesChange={setLeaseRenewalAddNotes}
            onNotesChange={setLeaseRenewalNotes}
          />
        ) : null}

        {currentPhaseIndex === 0 && !isLeaseRenewal ? (
          <>
            <CreateContractTenantStatusSelect
              labels={labels.tenantStatus}
              value={tenantData.status || "individual"}
              onChange={updateStatus}
              invalid={showFieldErrors && tenantData.status === ""}
            />

            {(tenantData.status || "individual") === "individual" ? (
              <CreateContractTenantIndividualDataPhase
                labels={labels.individualData}
                birthDateLabels={labels.birthDate}
                value={tenantData.individual}
                onChange={(individual) =>
                  setTenantData({ ...tenantData, individual })
                }
                showFieldErrors={showFieldErrors}
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
                showFieldErrors={showFieldErrors}
              />
            ) : null}
          </>
        ) : null}

        {isRentedUnitPhase && !isLeaseRenewal ? (
          <CreateContractRentedUnitDataPhase
            labels={labels.rentedUnit}
            units={rentedUnits}
            onChange={setRentedUnits}
          />
        ) : null}
      </div>

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting
            ? labels.navigation.submitting
            : isLeaseRenewalAmendmentsPhase
              ? labels.leaseRenewal.confirmContinue
              : labels.navigation.continue
        }
        saveLaterLabel={
          showDraftActions ? labels.navigation.saveLater : undefined
        }
        isSubmitting={isSubmitting || isSavingDraft}
        onPrevious={handlePrevious}
        onContinue={() => void handleContinue()}
        onSaveLater={showDraftActions ? handleOpenSaveLater : undefined}
      />

      <CreateContractSaveLaterDialog
        labels={labels.saveLaterDialog}
        open={saveLaterDialogOpen}
        onOpenChange={setSaveLaterDialogOpen}
        orderNumber={contractSession?.contractId}
        isSaving={isSavingDraft}
        onConfirm={() => void handleConfirmSaveLater()}
      />
    </div>
  );
}
