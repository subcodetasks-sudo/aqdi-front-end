"use client";

import { useState } from "react";

import { submitPropertyStep3 } from "@/features/create-unit/services/submit-property-step3";
import { updatePropertyStep3 } from "@/features/create-unit/services/update-property-step3";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import { areAllUnitsComplete } from "@/features/create-unit/types/unit-data";

export function useSubmitUnit(
  propertyId: number | null,
  propertyHasUnits: boolean,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const units = useCreateUnitDraftStore((state) => state.units);
  const preservedUnits = useCreateUnitDraftStore(
    (state) => state.preservedUnits,
  );
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

    const stampedUnits = units.map((unit) => ({
      ...unit,
      contractType: unit.contractType ?? contractType,
    }));
    const payloadUnits = [...preservedUnits, ...stampedUnits];

    setIsSubmitting(true);

    try {
      if (propertyHasUnits) {
        return await updatePropertyStep3({
          propertyId,
          units: payloadUnits,
          contractType,
        });
      }

      return await submitPropertyStep3({
        propertyId,
        units: payloadUnits,
        contractType,
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
