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
  hasExistingUnits: boolean;
  initialUnits: UnitDataState[] | null;
};

export default function CreateUnitWizard({
  labels,
  propertyId,
  contractType,
  contractTypeLocked,
  hasExistingUnits,
  initialUnits,
}: CreateUnitWizardProps) {
  const router = useRouter();
  const initializeSession = useCreateUnitDraftStore(
    (state) => state.initializeSession,
  );
  const resetDraft = useCreateUnitDraftStore((state) => state.resetDraft);

  useEffect(() => {
    initializeSession(propertyId, contractType, {
      hasExistingUnits,
      initialUnits: initialUnits ?? undefined,
    });
  }, [
    contractType,
    hasExistingUnits,
    initialUnits,
    initializeSession,
    propertyId,
  ]);

  function handleComplete(message?: string) {
    resetDraft();

    toast.success(
      message ||
        (hasExistingUnits
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
        hasExistingUnits={hasExistingUnits}
        onBack={() => router.back()}
        onComplete={handleComplete}
      />
    </div>
  );
}
