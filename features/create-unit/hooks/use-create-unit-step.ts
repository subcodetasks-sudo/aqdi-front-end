"use client";

import { useState } from "react";

import {
  EMPTY_UNIT_DATA,
  isUnitDataComplete,
  type UnitDataState,
} from "@/features/create-unit/types/unit-data";

export function useCreateUnitStep() {
  const [unitData, setUnitData] = useState<UnitDataState>(EMPTY_UNIT_DATA);

  const canContinue = isUnitDataComplete(unitData);

  return {
    unitData,
    setUnitData,
    canContinue,
  };
}
