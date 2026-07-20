"use client";

import { useState } from "react";

import { submitPropertyStep3 } from "@/features/create-unit/services/submit-property-step3";
import { updatePropertyStep3 } from "@/features/create-unit/services/update-property-step3";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import { areAllUnitsComplete } from "@/features/create-unit/types/unit-data";

export function useSubmitUnit(
  propertyId: number | null,
  hasExistingUnits: boolean,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const units = useCreateUnitDraftStore((state) => state.units);

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
      if (hasExistingUnits) {
        return await updatePropertyStep3({
          propertyId,
          units,
        });
      }

      return await submitPropertyStep3({
        propertyId,
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
