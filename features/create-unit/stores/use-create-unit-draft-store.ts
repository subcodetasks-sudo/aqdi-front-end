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
  isEditMode?: boolean;
  initialUnits?: UnitDataState[];
  preservedUnits?: UnitDataState[];
};

type CreateUnitDraftStore = {
  propertyId: number | null;
  isEditMode: boolean;
  contractType: PropertyContractType;
  currentStep: CreateUnitStep;
  units: UnitDataState[];
  preservedUnits: UnitDataState[];
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
  isEditMode = false,
  units: UnitDataState[] = [{ ...EMPTY_UNIT_DATA, contractType }],
  preservedUnits: UnitDataState[] = [],
) {
  return {
    propertyId,
    isEditMode,
    contractType,
    currentStep: "form" as CreateUnitStep,
    units: units.map((unit) => ({
      ...unit,
      contractType: unit.contractType ?? contractType,
    })),
    preservedUnits,
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
        const nextIsEditMode = options.isEditMode ?? false;
        const nextPreservedUnits = options.preservedUnits ?? [];
        const nextUnits =
          options.initialUnits && options.initialUnits.length > 0
            ? options.initialUnits
            : [{ ...EMPTY_UNIT_DATA, contractType }];
        const sessionChanged =
          state.propertyId !== propertyId ||
          state.isEditMode !== nextIsEditMode ||
          state.contractType !== contractType ||
          state.currentStep === "success";

        if (!sessionChanged) {
          if (options.preservedUnits) {
            set({ preservedUnits: nextPreservedUnits });
          }
          return;
        }

        set(
          createInitialUnitDraft(
            propertyId,
            contractType,
            nextIsEditMode,
            nextUnits,
            nextPreservedUnits,
          ),
        );
      },
      resetDraft: () => {
        const { propertyId, contractType, isEditMode } = get();
        set(createInitialUnitDraft(propertyId, contractType, isEditMode));
      },
    }),
    {
      name: "aqdi-create-unit-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        propertyId: state.propertyId,
        isEditMode: state.isEditMode,
        contractType: state.contractType,
        currentStep: state.currentStep === "success" ? "form" : state.currentStep,
        units: state.units,
        preservedUnits: state.preservedUnits,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        state.units = normalizePersistedUnits(state);
        state.preservedUnits = (state.preservedUnits ?? []).map((unit) =>
          normalizePersistedUnitData(unit),
        );

        if (state.currentStep === "success") {
          state.currentStep = "form";
        }
      },
    },
  ),
);
