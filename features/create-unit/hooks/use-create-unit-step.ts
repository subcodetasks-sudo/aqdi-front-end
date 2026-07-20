"use client";

import { areAllUnitsComplete } from "@/features/create-unit/types/unit-data";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";

export function useCreateUnitStep() {
  const units = useCreateUnitDraftStore((state) => state.units);
  const setUnits = useCreateUnitDraftStore((state) => state.setUnits);

  const canContinue = areAllUnitsComplete(units);

  return {
    units,
    setUnits,
    canContinue,
  };
}
