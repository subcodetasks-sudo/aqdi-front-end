"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CreateContractFinanceDataPhase from "@/features/create-contract/components/create-contract-finance-data-phase";
import CreateContractFinanceFinancialSummary from "@/features/create-contract/components/create-contract-finance-financial-summary";
import CreateContractOtherConditionsDialog from "@/features/create-contract/components/create-contract-other-conditions-dialog";
import CreateContractStepNavigation from "@/features/create-contract/components/create-contract-step-navigation";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import CreateContractTenantPermissionsDialog from "@/features/create-contract/components/create-contract-tenant-permissions-dialog";
import { useSubmitContractStep6 } from "@/features/create-contract/hooks/use-submit-contract-step6";
import { useCreateContractFinanceStep } from "@/features/create-contract/hooks/use-create-contract-finance-step";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";

type CreateContractFinanceStepProps = {
  labels: CreateContractLabels["finance"];
  summaryLabels: CreateContractLabels["payment"]["summary"];
  contractType: ContractTypeId;
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractFinanceStep({
  labels,
  summaryLabels,
  contractType,
  onBack,
  onComplete,
}: CreateContractFinanceStepProps) {
  const tIncomplete = useTranslations("createContract");
  const {
    financeData,
    setFinanceData,
    canContinue,
    tenantPermissionsDialogOpen,
    setTenantPermissionsDialogOpen,
    otherConditionsDialogOpen,
    setOtherConditionsDialogOpen,
    saveTenantRoles,
    saveOtherConditions,
  } = useCreateContractFinanceStep();
  const { submitStep6, isSubmitting } = useSubmitContractStep6();

  async function handleContinue() {
    if (isSubmitting) {
      return;
    }

    if (!canContinue) {
      toast.error(tIncomplete("incompleteContinue"));
      return;
    }

    const submitted = await submitStep6({ financeData });

    if (!submitted) {
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

        <div className="space-y-5">
          <CreateContractFinanceDataPhase
            labels={labels}
            contractType={contractType}
            value={financeData}
            onChange={setFinanceData}
            onOpenTenantPermissions={() => setTenantPermissionsDialogOpen(true)}
            onOpenOtherConditions={() => setOtherConditionsDialogOpen(true)}
          />

          <CreateContractFinanceFinancialSummary
            labels={summaryLabels}
            contractType={contractType}
          />
        </div>
      </div>

      <CreateContractTenantPermissionsDialog
        labels={labels.tenantPermissionsDialog}
        open={tenantPermissionsDialogOpen}
        onOpenChange={setTenantPermissionsDialogOpen}
        value={financeData.selectedTenantRoleIds}
        onSave={saveTenantRoles}
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
