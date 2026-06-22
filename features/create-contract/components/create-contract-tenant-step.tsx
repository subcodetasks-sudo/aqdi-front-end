"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import CreateContractRentedUnitDataPhase from "@/features/create-contract/components/create-contract-rented-unit-data-phase";
import CreateContractSaveLaterDialog from "@/features/create-contract/components/create-contract-save-later-dialog";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractStepPhaseProgress from "@/features/create-contract/components/create-contract-step-phase-progress";
import CreateContractTenantIndividualDataPhase from "@/features/create-contract/components/create-contract-tenant-individual-data-phase";
import CreateContractTenantOrganizationDataPhase from "@/features/create-contract/components/create-contract-tenant-organization-data-phase";
import CreateContractTenantStatusSelect from "@/features/create-contract/components/create-contract-tenant-status-select";
import { useCreateContractTenantStep } from "@/features/create-contract/hooks/use-create-contract-tenant-step";
import { TENANT_STEP_PHASE_COUNT } from "@/features/create-contract/types/rented-unit-step";
import { isOrganizationTenantStatus } from "@/features/create-contract/types/tenant-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractTenantStepProps = {
  labels: CreateContractLabels["tenant"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractTenantStep({
  labels,
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
    saveLaterOpen,
    setSaveLaterOpen,
    openSaveLaterDialog,
    goToNextPhase,
    goToPreviousPhase,
  } = useCreateContractTenantStep();

  const phase = labels.phases[currentPhaseIndex];

  function handlePrevious() {
    if (currentPhaseIndex === 0) {
      onBack();
      return;
    }

    goToPreviousPhase();
  }

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    if (isLastPhase) {
      onComplete();
      return;
    }

    goToNextPhase();
  }

  return (
    <div className="space-y-4">
      <CreateContractStepPhaseProgress
        totalPhases={TENANT_STEP_PHASE_COUNT}
        currentPhaseIndex={currentPhaseIndex}
      />

      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        {currentPhaseIndex === 0 && tenantData.status === "" ? (
          <div className="mb-4 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              className="h-auto gap-2 rounded-xl bg-[#fff0f0] px-4 py-2 text-sm font-semibold text-red-500 hover:bg-[#ffe5e5] hover:text-red-600"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {labels.cancelRequest}
            </Button>
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
        continueLabel={labels.navigation.continue}
        saveLaterLabel={
          currentPhaseIndex === 0 && tenantData.status === ""
            ? labels.navigation.saveLater
            : undefined
        }
        canContinue={canContinue}
        onPrevious={handlePrevious}
        onContinue={handleContinue}
        onSaveLater={
          currentPhaseIndex === 0 && tenantData.status === ""
            ? openSaveLaterDialog
            : undefined
        }
      />

      <CreateContractSaveLaterDialog
        labels={labels.saveLaterDialog}
        open={saveLaterOpen}
        onOpenChange={setSaveLaterOpen}
      />
    </div>
  );
}
