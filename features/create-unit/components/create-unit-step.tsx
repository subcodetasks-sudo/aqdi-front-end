"use client";

import { toast } from "sonner";

import CreateUnitDataForm from "@/features/create-unit/components/create-unit-data-form";
import CreateUnitStepNavigation from "@/features/create-unit/components/create-unit-step-navigation";
import CreateUnitStepPhaseHeader from "@/features/create-unit/components/create-unit-step-phase-header";
import { useSubmitUnit } from "@/features/create-unit/hooks/use-submit-unit";
import {
  useUnitTypeOptions,
  useUnitUsageOptions,
} from "@/features/create-unit/hooks/use-unit-lookup-options";
import { useCreateUnitStep } from "@/features/create-unit/hooks/use-create-unit-step";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type CreateUnitStepProps = {
  labels: CreateUnitLabels;
  propertyId: number | null;
  contractType: PropertyContractType;
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateUnitStep({
  labels,
  propertyId,
  contractType,
  onBack,
  onComplete,
}: CreateUnitStepProps) {
  const { unitData, setUnitData, canContinue } = useCreateUnitStep();
  const { isSubmitting, submitUnit } = useSubmitUnit(propertyId);
  const unitTypesQuery = useUnitTypeOptions(contractType);
  const unitUsageQuery = useUnitUsageOptions(contractType);

  const isLoadingOptions =
    unitTypesQuery.isLoading || unitUsageQuery.isLoading;
  const optionsError = unitTypesQuery.error ?? unitUsageQuery.error;

  async function handleContinue() {
    if (!canContinue || isSubmitting || isLoadingOptions || optionsError) {
      return;
    }

    const result = await submitUnit();

    if (!result.ok) {
      toast.error(result.error || labels.navigation.submitError);
      return;
    }

    onComplete();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateUnitStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
        />

        {optionsError ? (
          <p className="text-sm text-red-500">
            {optionsError instanceof Error
              ? optionsError.message
              : labels.navigation.submitError}
          </p>
        ) : null}

        {isLoadingOptions ? (
          <div className="space-y-3 py-4">
            <div className="h-14 animate-pulse rounded-full bg-brand-background" />
            <div className="h-14 animate-pulse rounded-full bg-brand-background" />
          </div>
        ) : (
          <CreateUnitDataForm
            labels={labels}
            unitTypeOptions={unitTypesQuery.data ?? []}
            unitUsageOptions={unitUsageQuery.data ?? []}
            value={unitData}
            onChange={setUnitData}
          />
        )}
      </div>

      <CreateUnitStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting ? labels.navigation.submitting : labels.navigation.continue
        }
        canContinue={canContinue && !isLoadingOptions && !optionsError}
        isSubmitting={isSubmitting}
        onPrevious={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
