"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  filesToPersisted,
  persistedToFiles,
  type PersistedFile,
} from "@/lib/storage/persisted-files";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import {
  DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION,
  type PropertyNationalAddressMethodId,
} from "@/features/create-property/types/national-address";
import {
  EMPTY_PROPERTY_AGENT_DATA,
  EMPTY_PROPERTY_OWNER_DATA,
  type PropertyAgentDataState,
  type PropertyOwnerDataState,
} from "@/features/create-property/types/owner-step";
import {
  CREATE_PROPERTY_STEPS,
  type CreatePropertyStep,
} from "@/features/create-property/types/create-property-step";
import {
  EMPTY_PROPERTY_REVIEW_DATA,
  type PropertyReviewDataState,
} from "@/features/create-property/types/review-step";

type PropertyDraftStore = {
  propertyId: number | null;
  currentStep: CreatePropertyStep;
  selectedDeedType: PropertyDeedTypeId | "";
  deedFiles: File[];
  deedPersistedFiles: PersistedFile[];
  addressMethod: PropertyNationalAddressMethodId;
  addressPhotoFiles: File[];
  addressPhotoPersistedFiles: PersistedFile[];
  addressLinkUrl: string;
  mapLocation: typeof DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION;
  ownerPhaseIndex: number;
  ownerData: PropertyOwnerDataState;
  agentData: PropertyAgentDataState;
  agentPersistedFiles: PersistedFile[];
  reviewData: PropertyReviewDataState;
  setPropertyId: (id: number | null) => void;
  setCurrentStep: (step: CreatePropertyStep) => void;
  goNextStep: () => void;
  goBackStep: () => void;
  setSelectedDeedType: (value: PropertyDeedTypeId | "") => void;
  setDeedFiles: (files: File[]) => Promise<void>;
  setAddressMethod: (method: PropertyNationalAddressMethodId) => void;
  setAddressPhotoFiles: (files: File[]) => Promise<void>;
  setAddressLinkUrl: (url: string) => void;
  setMapLocation: (location: typeof DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION) => void;
  setOwnerPhaseIndex: (index: number) => void;
  setOwnerData: (data: PropertyOwnerDataState) => void;
  setAgentData: (data: PropertyAgentDataState) => void;
  setReviewData: (data: PropertyReviewDataState) => void;
  resetDraft: () => void;
  hydrateFilesFromPersisted: () => void;
};

function normalizePersistedOwnerData(
  ownerData: Partial<PropertyOwnerDataState> | undefined,
): PropertyOwnerDataState {
  return {
    ...EMPTY_PROPERTY_OWNER_DATA,
    ...ownerData,
    birthDate: {
      ...EMPTY_PROPERTY_OWNER_DATA.birthDate,
      ...ownerData?.birthDate,
    },
    iban: ownerData?.iban ?? "",
  };
}

function createInitialPropertyDraft() {
  return {
    propertyId: null as number | null,
    currentStep: "deed" as CreatePropertyStep,
    selectedDeedType: "" as PropertyDeedTypeId | "",
    deedFiles: [] as File[],
    deedPersistedFiles: [] as PersistedFile[],
    addressMethod: "map" as PropertyNationalAddressMethodId,
    addressPhotoFiles: [] as File[],
    addressPhotoPersistedFiles: [] as PersistedFile[],
    addressLinkUrl: "",
    mapLocation: DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION,
    ownerPhaseIndex: 0,
    ownerData: { ...EMPTY_PROPERTY_OWNER_DATA },
    agentData: { ...EMPTY_PROPERTY_AGENT_DATA },
    agentPersistedFiles: [] as PersistedFile[],
    reviewData: { ...EMPTY_PROPERTY_REVIEW_DATA },
  };
}

export const useCreatePropertyDraftStore = create<PropertyDraftStore>()(
  persist(
    (set, get) => ({
      ...createInitialPropertyDraft(),
      setPropertyId: (id) => set({ propertyId: id }),
      setCurrentStep: (step) => set({ currentStep: step }),
      goNextStep: () => {
        const index = CREATE_PROPERTY_STEPS.indexOf(get().currentStep);
        if (index < CREATE_PROPERTY_STEPS.length - 1) {
          set({ currentStep: CREATE_PROPERTY_STEPS[index + 1] });
        }
      },
      goBackStep: () => {
        const index = CREATE_PROPERTY_STEPS.indexOf(get().currentStep);
        if (index > 0) {
          set({ currentStep: CREATE_PROPERTY_STEPS[index - 1] });
        }
      },
      setSelectedDeedType: (value) =>
        set((state) => ({
          selectedDeedType: value,
          deedFiles: value === "" ? [] : state.deedFiles,
          deedPersistedFiles: value === "" ? [] : state.deedPersistedFiles,
        })),
      setDeedFiles: async (files) => {
        const deedPersistedFiles = await filesToPersisted(files);
        set({ deedFiles: files, deedPersistedFiles });
      },
      setAddressMethod: (method) => set({ addressMethod: method }),
      setAddressPhotoFiles: async (files) => {
        const addressPhotoPersistedFiles = await filesToPersisted(files);
        set({ addressPhotoFiles: files, addressPhotoPersistedFiles });
      },
      setAddressLinkUrl: (url) => set({ addressLinkUrl: url }),
      setMapLocation: (location) => set({ mapLocation: location }),
      setOwnerPhaseIndex: (index) => set({ ownerPhaseIndex: index }),
      setOwnerData: (data) =>
        set((state) => {
          const resetAgent =
            data.hasAgent === "no" && state.ownerData.hasAgent === "yes";

          return {
            ownerData: data,
            agentData: resetAgent ? { ...EMPTY_PROPERTY_AGENT_DATA } : state.agentData,
            agentPersistedFiles: resetAgent ? [] : state.agentPersistedFiles,
          };
        }),
      setAgentData: (data) => {
        void filesToPersisted(data.powerOfAttorneyFiles).then((agentPersistedFiles) => {
          set({
            agentData: data,
            agentPersistedFiles,
          });
        });
      },
      setReviewData: (data) => set({ reviewData: data }),
      resetDraft: () => set(createInitialPropertyDraft()),
      hydrateFilesFromPersisted: () => {
        const state = get();
        set({
          deedFiles: persistedToFiles(state.deedPersistedFiles),
          addressPhotoFiles: persistedToFiles(state.addressPhotoPersistedFiles),
          agentData: {
            ...state.agentData,
            powerOfAttorneyFiles: persistedToFiles(state.agentPersistedFiles),
          },
        });
      },
    }),
    {
      name: "aqdi-create-property-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        propertyId: state.propertyId,
        currentStep:
          state.currentStep === "success" ? "deed" : state.currentStep,
        selectedDeedType: state.selectedDeedType,
        deedPersistedFiles: state.deedPersistedFiles,
        addressMethod: state.addressMethod,
        addressPhotoPersistedFiles: state.addressPhotoPersistedFiles,
        addressLinkUrl: state.addressLinkUrl,
        mapLocation: state.mapLocation,
        ownerPhaseIndex: state.ownerPhaseIndex,
        ownerData: state.ownerData,
        agentData: {
          idNumber: state.agentData.idNumber,
          birthDate: state.agentData.birthDate,
          phone: state.agentData.phone,
          powerOfAttorneyFiles: [],
        },
        agentPersistedFiles: state.agentPersistedFiles,
        reviewData: state.reviewData,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        state.ownerData = normalizePersistedOwnerData(state.ownerData);

        if (state.currentStep === "success") {
          state.currentStep = "deed";
        }

        state.hydrateFilesFromPersisted();
      },
    },
  ),
);
