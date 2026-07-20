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
  initialUnits?: UnitDataState[];
};

type CreateUnitDraftStore = {
  propertyId: number | null;
  hasExistingUnits: boolean;
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
    options?: InitializeSessionOptions & { hasExistingUnits?: boolean },
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
  hasExistingUnits = false,
  units: UnitDataState[] = [{ ...EMPTY_UNIT_DATA }],
) {
  return {
    propertyId,
    hasExistingUnits,
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
        const nextHasExistingUnits = options.hasExistingUnits ?? false;
        const nextUnits =
          options.initialUnits && options.initialUnits.length > 0
            ? options.initialUnits
            : [{ ...EMPTY_UNIT_DATA }];
        const sessionChanged =
          state.propertyId !== propertyId ||
          state.hasExistingUnits !== nextHasExistingUnits ||
          state.contractType !== contractType ||
          state.currentStep === "success";

        if (sessionChanged || options.initialUnits) {
          set(
            createInitialUnitDraft(
              propertyId,
              contractType,
              nextHasExistingUnits,
              nextUnits,
            ),
          );
        }
      },
      resetDraft: () => {
        const { propertyId, contractType, hasExistingUnits } = get();
        set(createInitialUnitDraft(propertyId, contractType, hasExistingUnits));
      },
    }),
    {
      name: "aqdi-create-unit-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        propertyId: state.propertyId,
        hasExistingUnits: state.hasExistingUnits,
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
