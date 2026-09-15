"use client";

import { useState } from "react";

import { useSubmitUnit } from "@/features/create-unit/hooks/use-submit-unit";
import {
  useUnitTypeOptions,
  useUnitUsageOptions,
} from "@/features/create-unit/hooks/use-unit-lookup-options";
import { useCreateUnitStep } from "@/features/create-unit/hooks/use-create-unit-step";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import { EMPTY_UNIT_DATA } from "@/features/create-unit/types/unit-data";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import CreateUnitStepNavigation from "@/features/create-unit/components/create-unit-step-navigation";
import CreateUnitStepPhaseHeader from "@/features/create-unit/components/create-unit-step-phase-header";
import UnitDataFormFields from "@/features/shared/components/unit-data-form-fields";
import UnitsDataFormList from "@/features/shared/components/unit-form/units-data-form-list";
import { buildUnitFormSummary } from "@/features/shared/utils/build-unit-form-summary";
import { scrollToFirstInvalidField } from "@/features/shared/utils/scroll-to-first-invalid-field";
import { toast } from "sonner";

type CreateUnitStepProps = {
  labels: CreateUnitLabels;
  propertyId: number | null;
  contractTypeLocked: boolean;
  hideContractTypeSelector: boolean;
  isEditMode: boolean;
  propertyHasUnits: boolean;
  onBack: () => void;
  onComplete: (message?: string) => void;
};

function clearHousingOnlyFields() {
  return {
    roomsCount: "",
    bathroomsCount: "",
    kitchensCount: "",
    kitchenCabinetsInstalled: false,
    furnished: false,
    furnishingType: "" as const,
  };
}

export default function CreateUnitStep({
  labels,
  propertyId,
  contractTypeLocked,
  hideContractTypeSelector,
  isEditMode,
  propertyHasUnits,
  onBack,
  onComplete,
}: CreateUnitStepProps) {
  const { units, setUnits, canContinue } = useCreateUnitStep();
  const defaultContractType = useCreateUnitDraftStore(
    (state) => state.contractType,
  );
  const { isSubmitting, submitUnit } = useSubmitUnit(
    propertyId,
    propertyHasUnits,
    isEditMode,
  );
  const housingTypesQuery = useUnitTypeOptions("housing");
  const commercialTypesQuery = useUnitTypeOptions("commercial");
  const housingUsageQuery = useUnitUsageOptions("housing");
  const commercialUsageQuery = useUnitUsageOptions("commercial");
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const isLoadingOptions =
    housingTypesQuery.isLoading ||
    commercialTypesQuery.isLoading ||
    housingUsageQuery.isLoading ||
    commercialUsageQuery.isLoading;
  const optionsError =
    housingTypesQuery.error ??
    commercialTypesQuery.error ??
    housingUsageQuery.error ??
    commercialUsageQuery.error;

  function resolveUnitContractType(
    unitContractType: PropertyContractType | undefined,
  ): PropertyContractType {
    return unitContractType ?? defaultContractType;
  }

  function getOptionsForContractType(contractType: PropertyContractType) {
    if (contractType === "commercial") {
      return {
        unitTypeOptions: commercialTypesQuery.data ?? [],
        unitUsageOptions: commercialUsageQuery.data ?? [],
      };
    }

    return {
      unitTypeOptions: housingTypesQuery.data ?? [],
      unitUsageOptions: housingUsageQuery.data ?? [],
    };
  }

  async function handleContinue() {
    if (isSubmitting || isLoadingOptions || optionsError) {
      return;
    }

    if (!canContinue) {
      setShowFieldErrors(true);
      toast.error(labels.incompleteContinue);
      setTimeout(scrollToFirstInvalidField, 0);
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
          title={isEditMode ? labels.editTitle : labels.title}
          subtitle={isEditMode ? labels.editSubtitle : labels.subtitle}
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
            removeUnitLabel={labels.removeUnit}
            unitsCountLabel={labels.unitsCount}
            unitSectionTitle={(index) => `${labels.unitListTitle} ${index + 1}`}
            getUnitSummary={(unit) =>
              buildUnitFormSummary(unit, {
                unitTypeOptions: getOptionsForContractType(
                  resolveUnitContractType(unit.contractType),
                ).unitTypeOptions,
                groundFloorLabel: labels.floorOptions.ground,
                floorPrefix: labels.floorSummaryPrefix,
              })
            }
            units={units}
            onUnitsChange={(nextUnits) =>
              setUnits(
                nextUnits.map((unit) => ({
                  ...unit,
                  contractType: resolveUnitContractType(unit.contractType),
                })),
              )
            }
            allowAddUnit
            allowRemoveUnit
            createEmptyUnit={() => ({
              ...EMPTY_UNIT_DATA,
              contractType: defaultContractType,
            })}
            renderUnitForm={(unit, _index, onUnitChange) => {
              const unitContractType = resolveUnitContractType(
                unit.contractType,
              );
              const { unitTypeOptions, unitUsageOptions } =
                getOptionsForContractType(unitContractType);

              return (
                <UnitDataFormFields
                  labels={{
                    ...labels,
                    unitCardTitle: undefined,
                    contractType: {
                      ...labels.contractType,
                      linkedLabel: labels.contractType.label,
                    },
                  }}
                  contractType={unitContractType}
                  contractTypeSelectorVariant="cards"
                  hideContractTypeSelector={hideContractTypeSelector}
                  hideHousingOnlyFieldsForCommercial
                  onContractTypeChange={
                    contractTypeLocked
                      ? undefined
                      : (nextContractType) => {
                          onUnitChange({
                            ...unit,
                            contractType: nextContractType,
                            unitTypeId: "",
                            unitUsageId: "",
                            ...(nextContractType === "commercial"
                              ? clearHousingOnlyFields()
                              : {}),
                          });
                        }
                  }
                  unitTypeOptions={unitTypeOptions}
                  unitUsageOptions={unitUsageOptions}
                  value={unit}
                  onChange={onUnitChange}
                  showFieldErrors={showFieldErrors}
                />
              );
            }}
          />
        )}

        <CreateUnitStepNavigation
          previousLabel={labels.navigation.previous}
          continueLabel={
            isSubmitting
              ? labels.navigation.submitting
              : isEditMode
                ? labels.navigation.save
                : labels.navigation.continue
          }
          isSubmitting={
            isSubmitting || isLoadingOptions || Boolean(optionsError)
          }
          onPrevious={onBack}
          onContinue={() => void handleContinue()}
        />
      </div>
    </div>
  );
}
