"use client";

import { useState } from "react";

import { createUnit } from "@/features/create-unit/services/create-unit";
import { useCreateUnitDraftStore } from "@/features/create-unit/stores/use-create-unit-draft-store";
import { isUnitDataComplete } from "@/features/create-unit/types/unit-data";

export function useSubmitUnit(propertyId: number | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unitData = useCreateUnitDraftStore((state) => state.unitData);

  async function submitUnit() {
    if (!propertyId) {
      return {
        ok: false as const,
        error: "Property ID is missing.",
      };
    }

    if (!isUnitDataComplete(unitData)) {
      return {
        ok: false as const,
        error: "Unit data is incomplete",
      };
    }

    setIsSubmitting(true);

    try {
      return await createUnit({
        propertyId,
        unitData,
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
