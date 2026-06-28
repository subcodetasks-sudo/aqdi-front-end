"use client";

import { isUnitDataComplete } from "@/features/create-unit/types/unit-data";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";

export function useCreateUnitStep() {
  const unitData = useCreateUnitDraftStore((state) => state.unitData);
  const setUnitData = useCreateUnitDraftStore((state) => state.setUnitData);

  const canContinue = isUnitDataComplete(unitData);

  return {
    unitData,
    setUnitData,
    canContinue,
  };
}
