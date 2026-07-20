"use client";

import { useState } from "react";

import { createUnit } from "@/features/create-unit/services/create-unit";
import { updateUnit } from "@/features/create-unit/services/update-unit";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import { areAllUnitsComplete } from "@/features/create-unit/types/unit-data";

export function useSubmitUnit(propertyId: number | null, unitId: number | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const units = useCreateUnitDraftStore((state) => state.units);
  const contractType = useCreateUnitDraftStore((state) => state.contractType);

  async function submitUnit() {
    if (!propertyId) {
      return {
        ok: false as const,
        error: "Property ID is missing.",
      };
    }

    if (!areAllUnitsComplete(units)) {
      return {
        ok: false as const,
        error: "Unit data is incomplete",
      };
    }

    setIsSubmitting(true);

    try {
      if (unitId) {
        return await updateUnit({
          unitId,
          propertyId,
          contractType,
          unitData: units[0],
        });
      }

      return await createUnit({
        propertyId,
        contractType,
        units,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    submitUnit,
  };
}
