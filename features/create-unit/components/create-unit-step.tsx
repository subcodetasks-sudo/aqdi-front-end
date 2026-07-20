"use client";

import { useSubmitUnit } from "@/features/create-unit/hooks/use-submit-unit";
import {
  useUnitTypeOptions,
  useUnitUsageOptions,
} from "@/features/create-unit/hooks/use-unit-lookup-options";
import { useCreateUnitStep } from "@/features/create-unit/hooks/use-create-unit-step";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import CreateUnitStepNavigation from "@/features/create-unit/components/create-unit-step-navigation";
import CreateUnitStepPhaseHeader from "@/features/create-unit/components/create-unit-step-phase-header";
import UnitDataFormFields from "@/features/shared/components/unit-data-form-fields";
import UnitsDataFormList from "@/features/shared/components/unit-form/units-data-form-list";
import { toast } from "sonner";

type CreateUnitStepProps = {
  labels: CreateUnitLabels;
  propertyId: number | null;
  contractTypeLocked: boolean;
  unitId: number | null;
  onBack: () => void;
  onComplete: (message?: string) => void;
};

export default function CreateUnitStep({
  labels,
  propertyId,
  contractTypeLocked,
  unitId,
  onBack,
  onComplete,
}: CreateUnitStepProps) {
  const { units, setUnits, canContinue } = useCreateUnitStep();
  const contractType = useCreateUnitDraftStore((state) => state.contractType);
  const setContractType = useCreateUnitDraftStore((state) => state.setContractType);
  const { isSubmitting, submitUnit } = useSubmitUnit(propertyId, unitId);
  const unitTypesQuery = useUnitTypeOptions(contractType);
  const unitUsageQuery = useUnitUsageOptions(contractType);

  const isLoadingOptions = unitTypesQuery.isLoading || unitUsageQuery.isLoading;
  const optionsError = unitTypesQuery.error ?? unitUsageQuery.error;
  const isEditMode = unitId !== null;

  async function handleContinue() {
    if (!canContinue || isSubmitting || isLoadingOptions || optionsError) {
      return;
    }

    const result = await submitUnit();

    if (!result.ok) {
      toast.error(result.error || labels.navigation.submitError);
      return;
    }

    onComplete(result.message);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateUnitStepPhaseHeader
          title={unitId ? labels.editTitle : labels.title}
          subtitle={unitId ? labels.editSubtitle : labels.subtitle}
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
          <UnitsDataFormList
            addUnitLabel={labels.addUnit}
            unitsCountLabel={labels.unitsCount}
            unitSectionTitle={
              units.length > 1
                ? (index) => `${labels.unitListTitle} ${index + 1}`
                : undefined
            }
            units={units}
            onUnitsChange={setUnits}
            allowAddUnit={!isEditMode}
            renderUnitForm={(unit, _index, onUnitChange) => (
              <UnitDataFormFields
                labels={labels}
                contractType={contractType}
                onContractTypeChange={
                  contractTypeLocked ? undefined : setContractType
                }
                unitTypeOptions={unitTypesQuery.data ?? []}
                unitUsageOptions={unitUsageQuery.data ?? []}
                value={unit}
                onChange={onUnitChange}
              />
            )}
          />
        )}
      </div>

      <CreateUnitStepNavigation
        previousLabel={labels.navigation.previous}
        continueLabel={
          isSubmitting
            ? labels.navigation.submitting
            : unitId
              ? labels.navigation.save
              : labels.navigation.continue
        }
        canContinue={canContinue && !isLoadingOptions && !optionsError}
        isSubmitting={isSubmitting}
        onPrevious={onBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
