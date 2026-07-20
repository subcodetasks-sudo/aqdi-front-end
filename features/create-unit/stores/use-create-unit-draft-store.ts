"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import {
  EMPTY_UNIT_DATA,
  type UnitDataState,
} from "@/features/create-unit/types/unit-data";
import type { CreateUnitStep } from "@/features/create-unit/types/create-unit-step";

type InitializeSessionOptions = {
  unitId?: number | null;
  unitData?: UnitDataState;
};

type CreateUnitDraftStore = {
  propertyId: number | null;
  unitId: number | null;
  contractType: PropertyContractType;
  currentStep: CreateUnitStep;
  units: UnitDataState[];
  setCurrentStep: (step: CreateUnitStep) => void;
  goNextStep: () => void;
  goBackStep: () => void;
  setContractType: (contractType: PropertyContractType) => void;
  setUnits: (units: UnitDataState[]) => void;
  initializeSession: (
    propertyId: number | null,
    contractType: PropertyContractType,
    options?: InitializeSessionOptions,
  ) => void;
  resetDraft: () => void;
};

function normalizePersistedUnitData(
  unitData: Partial<UnitDataState> & {
    unitType?: string;
    unitUsage?: string;
  },
): UnitDataState {
  return {
    ...EMPTY_UNIT_DATA,
    ...unitData,
    unitTypeId: unitData.unitTypeId ?? unitData.unitType ?? "",
    unitUsageId: unitData.unitUsageId ?? unitData.unitUsage ?? "",
  };
}

function createInitialUnitDraft(
  propertyId: number | null = null,
  contractType: PropertyContractType = "housing",
  unitId: number | null = null,
  units: UnitDataState[] = [{ ...EMPTY_UNIT_DATA }],
) {
  return {
    propertyId,
    unitId,
    contractType,
    currentStep: "form" as CreateUnitStep,
    units,
  };
}

function normalizePersistedUnits(
  state: Partial<CreateUnitDraftStore> & { unitData?: UnitDataState },
): UnitDataState[] {
  if (state.units?.length) {
    return state.units.map((unit) => normalizePersistedUnitData(unit));
  }

  if (state.unitData) {
    return [normalizePersistedUnitData(state.unitData)];
  }

  return [{ ...EMPTY_UNIT_DATA }];
}

export const useCreateUnitDraftStore = create<CreateUnitDraftStore>()(
  persist(
    (set, get) => ({
      ...createInitialUnitDraft(),
      setCurrentStep: (step) => set({ currentStep: step }),
      goNextStep: () => set({ currentStep: "success" }),
      goBackStep: () => set({ currentStep: "form" }),
      setContractType: (contractType) =>
        set((state) => ({
          contractType,
          units: state.units.map((unit) => ({
            ...unit,
            unitTypeId: "",
            unitUsageId: "",
          })),
        })),
      setUnits: (units) => set({ units }),
      initializeSession: (propertyId, contractType, options = {}) => {
        const state = get();
        const nextUnitId = options.unitId ?? null;
        const sessionChanged =
          state.propertyId !== propertyId ||
          state.unitId !== nextUnitId ||
          state.contractType !== contractType ||
          state.currentStep === "success";

        if (sessionChanged || options.unitData) {
          set(
            createInitialUnitDraft(
              propertyId,
              contractType,
              nextUnitId,
              options.unitData ? [options.unitData] : [{ ...EMPTY_UNIT_DATA }],
            ),
          );
        }
      },
      resetDraft: () => {
        const { propertyId, contractType, unitId } = get();
        set(createInitialUnitDraft(propertyId, contractType, unitId));
      },
    }),
    {
      name: "aqdi-create-unit-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        propertyId: state.propertyId,
        unitId: state.unitId,
        contractType: state.contractType,
        currentStep: state.currentStep === "success" ? "form" : state.currentStep,
        units: state.units,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        state.units = normalizePersistedUnits(state);

        if (state.currentStep === "success") {
          state.currentStep = "form";
        }
      },
    },
  ),
);
