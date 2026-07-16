"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CreateUnitStep from "@/features/create-unit/components/create-unit-step";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import type { CreateUnitLabels } from "@/features/create-unit/types/create-unit-labels";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

type CreateUnitWizardProps = {
  labels: CreateUnitLabels;
  propertyId: number | null;
  contractType: PropertyContractType;
  contractTypeLocked: boolean;
  unitId: number | null;
  initialUnitData: UnitDataState | null;
};

export default function CreateUnitWizard({
  labels,
  propertyId,
  contractType,
  contractTypeLocked,
  unitId,
  initialUnitData,
}: CreateUnitWizardProps) {
  const router = useRouter();
  const initializeSession = useCreateUnitDraftStore(
    (state) => state.initializeSession,
  );
  const resetDraft = useCreateUnitDraftStore((state) => state.resetDraft);

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

  function handleComplete(message?: string) {
    resetDraft();

    toast.success(
      message ||
        (unitId
          ? labels.navigation.updateSuccess
          : labels.navigation.createSuccess),
    );

    if (propertyId) {
      router.push(
        `/properties/my-properties/units?propertyId=${propertyId}&contract_type=${contractType}`,
      );
      return;
    }

    router.back();
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <CreateUnitStep
        labels={labels}
        propertyId={propertyId}
        contractTypeLocked={contractTypeLocked}
        unitId={unitId}
        onBack={() => router.back()}
        onComplete={handleComplete}
      />
    </div>
  );
}
