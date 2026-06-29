"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CreateUnitStep from "@/features/create-unit/components/create-unit-step";
import CreateUnitSuccessStep from "@/features/create-unit/components/create-unit-success-step";
import { useCreateUnitSteps } from "@/features/create-unit/hooks/use-create-unit-steps";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type CreateUnitWizardProps = {
  labels: CreateUnitLabels;
  propertyId: number | null;
  contractType: PropertyContractType;
  unitId: number | null;
  initialUnitData: UnitDataState | null;
};

export default function CreateUnitWizard({
  labels,
  propertyId,
  contractType,
  unitId,
  initialUnitData,
}: CreateUnitWizardProps) {
  const router = useRouter();
  const { currentStep, setCurrentStep } = useCreateUnitSteps();
  const initializeSession = useCreateUnitDraftStore(
    (state) => state.initializeSession,
  );
  const resetDraft = useCreateUnitDraftStore((state) => state.resetDraft);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    initializeSession(propertyId, contractType, {
      unitId,
      unitData: initialUnitData ?? undefined,
    });
  }, [
    contractType,
    initialUnitData,
    initializeSession,
    propertyId,
    unitId,
  ]);

  useEffect(() => {
    if (currentStep === "success" && !isCompleted) {
      setCurrentStep("form");
    }
  }, [currentStep, isCompleted, setCurrentStep]);

  function handleComplete(message?: string) {
    resetDraft();

    if (unitId) {
      toast.success(message || labels.navigation.updateSuccess);

      if (propertyId) {
        router.push(
          `/properties/my-properties/units?propertyId=${propertyId}&contract_type=${contractType}`,
        );
      } else {
        router.back();
      }

      return;
    }

    setIsCompleted(true);
  }

  if (isCompleted) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <CreateUnitSuccessStep labels={labels.success} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      {currentStep === "form" ? (
        <CreateUnitStep
          labels={labels}
          propertyId={propertyId}
          unitId={unitId}
          onBack={() => router.back()}
          onComplete={handleComplete}
        />
      ) : null}
    </div>
  );
}
