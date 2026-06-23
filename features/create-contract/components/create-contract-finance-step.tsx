"use client";

import CreateContractFinanceDataPhase from "@/features/create-contract/components/create-contract-finance-data-phase";
import CreateContractOtherConditionsDialog from "@/features/create-contract/components/create-contract-other-conditions-dialog";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractTenantPermissionsDialog from "@/features/create-contract/components/create-contract-tenant-permissions-dialog";
import { useCreateContractFinanceStep } from "@/features/create-contract/hooks/use-create-contract-finance-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractFinanceStepProps = {
  labels: CreateContractLabels["finance"];
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractFinanceStep({
  labels,
  onBack,
  onComplete,
}: CreateContractFinanceStepProps) {
  const {
    financeData,
    setFinanceData,
    canContinue,
    tenantPermissionsDialogOpen,
    setTenantPermissionsDialogOpen,
    otherConditionsDialogOpen,
    setOtherConditionsDialogOpen,
    saveTenantPermissions,
    saveOtherConditions,
  } = useCreateContractFinanceStep();

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateContractStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
          icon="dollar"
        />

        <CreateContractFinanceDataPhase
          labels={labels}
          value={financeData}
          onChange={setFinanceData}
          onOpenTenantPermissions={() => setTenantPermissionsDialogOpen(true)}
          onOpenOtherConditions={() => setOtherConditionsDialogOpen(true)}
        />
      </div>

      <CreateContractTenantPermissionsDialog
        labels={labels.tenantPermissionsDialog}
        open={tenantPermissionsDialogOpen}
        onOpenChange={setTenantPermissionsDialogOpen}
        value={financeData.tenantPermissions}
        onSave={saveTenantPermissions}
      />

      <CreateContractOtherConditionsDialog
        labels={labels.otherConditionsDialog}
        open={otherConditionsDialogOpen}
        onOpenChange={setOtherConditionsDialogOpen}
        value={financeData.otherConditionsText}
        onSave={saveOtherConditions}
      />

      <CreateContractStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={labels.navigation.continue}
        canContinue={canContinue}
        onPrevious={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
