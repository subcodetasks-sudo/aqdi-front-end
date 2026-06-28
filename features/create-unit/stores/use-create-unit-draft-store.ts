"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  EMPTY_UNIT_DATA,
  type UnitDataState,
} from "@/features/create-unit/types/unit-data";
import type { CreateUnitStep } from "@/features/create-unit/types/create-unit-step";

type CreateUnitDraftStore = {
  currentStep: CreateUnitStep;
  unitData: UnitDataState;
  setCurrentStep: (step: CreateUnitStep) => void;
  goNextStep: () => void;
  goBackStep: () => void;
  setUnitData: (
    data: UnitDataState | ((current: UnitDataState) => UnitDataState),
  ) => void;
  resetDraft: () => void;
};

function createInitialUnitDraft() {
  return {
    currentStep: "form" as CreateUnitStep,
    unitData: { ...EMPTY_UNIT_DATA },
  };
}

export const useCreateUnitDraftStore = create<CreateUnitDraftStore>()(
  persist(
    (set, get) => ({
      ...createInitialUnitDraft(),
      setCurrentStep: (step) => set({ currentStep: step }),
      goNextStep: () => {
        set({ currentStep: get().currentStep === "form" ? "success" : "success" });
      },
      goBackStep: () => {
        set({ currentStep: get().currentStep === "success" ? "form" : "form" });
      },
      setUnitData: (data) =>
        set((state) => ({
          unitData: typeof data === "function" ? data(state.unitData) : data,
        })),
      resetDraft: () => set(createInitialUnitDraft()),
    }),
    {
      name: "aqdi-create-unit-draft",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
