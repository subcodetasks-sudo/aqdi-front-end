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
  EMPTY_MANUAL_NATIONAL_ADDRESS,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";
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
  isEditMode: boolean;
  existingDeedImageUrl: string | null;
  existingDeedFrontImageUrl: string | null;
  existingDeedBackImageUrl: string | null;
  existingInheritanceImageUrl: string | null;
  existingHeirsPoaImageUrl: string | null;
  existingEndowmentCertImageUrl: string | null;
  existingTrusteeshipImageUrl: string | null;
  existingGuardiansPoaImageUrl: string | null;
  existingAddressImageUrl: string | null;
  hasExistingPowerOfAttorney: boolean;
  currentStep: CreatePropertyStep;
  selectedDeedType: PropertyDeedTypeId | "";
  deedFiles: File[];
  deedPersistedFiles: PersistedFile[];
  deedFrontFiles: File[];
  deedFrontPersistedFiles: PersistedFile[];
  deedBackFiles: File[];
  deedBackPersistedFiles: PersistedFile[];
  deedInheritanceFiles: File[];
  deedInheritancePersistedFiles: PersistedFile[];
  deedHeirsPoaFiles: File[];
  deedHeirsPoaPersistedFiles: PersistedFile[];
  deedEndowmentCertFiles: File[];
  deedEndowmentCertPersistedFiles: PersistedFile[];
  deedTrusteeshipFiles: File[];
  deedTrusteeshipPersistedFiles: PersistedFile[];
  isMultipleTrusteeshipDeedCopy: boolean;
  deedGuardiansPoaFiles: File[];
  deedGuardiansPoaPersistedFiles: PersistedFile[];
  addressMethod: PropertyNationalAddressMethodId | "";
  addressPhotoFiles: File[];
  addressPhotoPersistedFiles: PersistedFile[];
  addressLinkUrl: string;
  addressManual: ManualNationalAddressData;
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
  setDeedFrontFiles: (files: File[]) => Promise<void>;
  setDeedBackFiles: (files: File[]) => Promise<void>;
  setDeedInheritanceFiles: (files: File[]) => Promise<void>;
  setDeedHeirsPoaFiles: (files: File[]) => Promise<void>;
  setDeedEndowmentCertFiles: (files: File[]) => Promise<void>;
  setDeedTrusteeshipFiles: (files: File[]) => Promise<void>;
  setIsMultipleTrusteeshipDeedCopy: (value: boolean) => void;
  setDeedGuardiansPoaFiles: (files: File[]) => Promise<void>;
  setAddressMethod: (method: PropertyNationalAddressMethodId) => void;
  setAddressPhotoFiles: (files: File[]) => Promise<void>;
  setAddressLinkUrl: (url: string) => void;
  setAddressManual: (value: ManualNationalAddressData) => void;
  setMapLocation: (location: typeof DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION) => void;
  setOwnerPhaseIndex: (index: number) => void;
  setOwnerData: (data: PropertyOwnerDataState) => void;
  setAgentData: (data: PropertyAgentDataState) => void;
  setReviewData: (data: PropertyReviewDataState) => void;
  resetDraft: () => void;
  initializeNewSession: () => void;
  hydrateFilesFromPersisted: () => void;
  initializeEditSession: (
    data: import("@/features/create-property/utils/map-property-api-to-draft").PropertyEditDraftData,
  ) => void;
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
    isEditMode: false,
    existingDeedImageUrl: null as string | null,
    existingDeedFrontImageUrl: null as string | null,
    existingDeedBackImageUrl: null as string | null,
    existingInheritanceImageUrl: null as string | null,
    existingHeirsPoaImageUrl: null as string | null,
    existingEndowmentCertImageUrl: null as string | null,
    existingTrusteeshipImageUrl: null as string | null,
    existingGuardiansPoaImageUrl: null as string | null,
    existingAddressImageUrl: null as string | null,
    hasExistingPowerOfAttorney: false,
    currentStep: "deed" as CreatePropertyStep,
    selectedDeedType: "" as PropertyDeedTypeId | "",
    deedFiles: [] as File[],
    deedPersistedFiles: [] as PersistedFile[],
    deedFrontFiles: [] as File[],
    deedFrontPersistedFiles: [] as PersistedFile[],
    deedBackFiles: [] as File[],
    deedBackPersistedFiles: [] as PersistedFile[],
    deedInheritanceFiles: [] as File[],
    deedInheritancePersistedFiles: [] as PersistedFile[],
    deedHeirsPoaFiles: [] as File[],
    deedHeirsPoaPersistedFiles: [] as PersistedFile[],
    deedEndowmentCertFiles: [] as File[],
    deedEndowmentCertPersistedFiles: [] as PersistedFile[],
    deedTrusteeshipFiles: [] as File[],
    deedTrusteeshipPersistedFiles: [] as PersistedFile[],
    isMultipleTrusteeshipDeedCopy: false,
    deedGuardiansPoaFiles: [] as File[],
    deedGuardiansPoaPersistedFiles: [] as PersistedFile[],
    addressMethod: "" as PropertyNationalAddressMethodId | "",
    addressPhotoFiles: [] as File[],
    addressPhotoPersistedFiles: [] as PersistedFile[],
    addressLinkUrl: "",
    addressManual: { ...EMPTY_MANUAL_NATIONAL_ADDRESS },
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
          deedFrontFiles: value === "" ? [] : state.deedFrontFiles,
          deedFrontPersistedFiles:
            value === "" ? [] : state.deedFrontPersistedFiles,
          deedBackFiles: value === "" ? [] : state.deedBackFiles,
          deedBackPersistedFiles: value === "" ? [] : state.deedBackPersistedFiles,
          deedInheritanceFiles: value === "" ? [] : state.deedInheritanceFiles,
          deedInheritancePersistedFiles:
            value === "" ? [] : state.deedInheritancePersistedFiles,
          deedHeirsPoaFiles: value === "" ? [] : state.deedHeirsPoaFiles,
          deedHeirsPoaPersistedFiles:
            value === "" ? [] : state.deedHeirsPoaPersistedFiles,
          deedEndowmentCertFiles: value === "" ? [] : state.deedEndowmentCertFiles,
          deedEndowmentCertPersistedFiles:
            value === "" ? [] : state.deedEndowmentCertPersistedFiles,
          deedTrusteeshipFiles: value === "" ? [] : state.deedTrusteeshipFiles,
          deedTrusteeshipPersistedFiles:
            value === "" ? [] : state.deedTrusteeshipPersistedFiles,
          isMultipleTrusteeshipDeedCopy:
            value === "" ? false : state.isMultipleTrusteeshipDeedCopy,
          deedGuardiansPoaFiles: value === "" ? [] : state.deedGuardiansPoaFiles,
          deedGuardiansPoaPersistedFiles:
            value === "" ? [] : state.deedGuardiansPoaPersistedFiles,
        })),
      setDeedFiles: async (files) => {
        const deedPersistedFiles = await filesToPersisted(files);
        set({ deedFiles: files, deedPersistedFiles });
      },
      setDeedFrontFiles: async (files) => {
        const deedFrontPersistedFiles = await filesToPersisted(files);
        set({ deedFrontFiles: files, deedFrontPersistedFiles });
      },
      setDeedBackFiles: async (files) => {
        const deedBackPersistedFiles = await filesToPersisted(files);
        set({ deedBackFiles: files, deedBackPersistedFiles });
      },
      setDeedInheritanceFiles: async (files) => {
        const deedInheritancePersistedFiles = await filesToPersisted(files);
        set({ deedInheritanceFiles: files, deedInheritancePersistedFiles });
      },
      setDeedHeirsPoaFiles: async (files) => {
        const deedHeirsPoaPersistedFiles = await filesToPersisted(files);
        set({ deedHeirsPoaFiles: files, deedHeirsPoaPersistedFiles });
      },
      setDeedEndowmentCertFiles: async (files) => {
        const deedEndowmentCertPersistedFiles = await filesToPersisted(files);
        set({ deedEndowmentCertFiles: files, deedEndowmentCertPersistedFiles });
      },
      setDeedTrusteeshipFiles: async (files) => {
        const deedTrusteeshipPersistedFiles = await filesToPersisted(files);
        set({ deedTrusteeshipFiles: files, deedTrusteeshipPersistedFiles });
      },
      setIsMultipleTrusteeshipDeedCopy: (value) =>
        set((state) => ({
          isMultipleTrusteeshipDeedCopy: value,
          deedGuardiansPoaFiles: value ? state.deedGuardiansPoaFiles : [],
          deedGuardiansPoaPersistedFiles: value
            ? state.deedGuardiansPoaPersistedFiles
            : [],
        })),
      setDeedGuardiansPoaFiles: async (files) => {
        const deedGuardiansPoaPersistedFiles = await filesToPersisted(files);
        set({ deedGuardiansPoaFiles: files, deedGuardiansPoaPersistedFiles });
      },
      setAddressMethod: (method) => set({ addressMethod: method }),
      setAddressPhotoFiles: async (files) => {
        const addressPhotoPersistedFiles = await filesToPersisted(files);
        set({ addressPhotoFiles: files, addressPhotoPersistedFiles });
      },
      setAddressLinkUrl: (url) => set({ addressLinkUrl: url }),
      setAddressManual: (value) => set({ addressManual: value }),
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
      initializeNewSession: () => {
        localStorage.removeItem("aqdi-create-property-draft");
        set(createInitialPropertyDraft());
      },
      hydrateFilesFromPersisted: () => {
        const state = get();
        set({
          deedFiles: persistedToFiles(state.deedPersistedFiles),
          deedFrontFiles: persistedToFiles(state.deedFrontPersistedFiles),
          deedBackFiles: persistedToFiles(state.deedBackPersistedFiles),
          deedInheritanceFiles: persistedToFiles(state.deedInheritancePersistedFiles),
          deedHeirsPoaFiles: persistedToFiles(state.deedHeirsPoaPersistedFiles),
          deedEndowmentCertFiles: persistedToFiles(
            state.deedEndowmentCertPersistedFiles,
          ),
          deedTrusteeshipFiles: persistedToFiles(state.deedTrusteeshipPersistedFiles),
          deedGuardiansPoaFiles: persistedToFiles(
            state.deedGuardiansPoaPersistedFiles,
          ),
          addressPhotoFiles: persistedToFiles(state.addressPhotoPersistedFiles),
          agentData: {
            ...state.agentData,
            powerOfAttorneyFiles: persistedToFiles(state.agentPersistedFiles),
          },
        });
      },
      initializeEditSession: (data) => {
        localStorage.removeItem("aqdi-create-property-draft");
        set({
          ...createInitialPropertyDraft(),
          propertyId: data.propertyId,
          isEditMode: true,
          existingDeedImageUrl: data.existingDeedImageUrl,
          existingDeedFrontImageUrl: data.existingDeedFrontImageUrl,
          existingDeedBackImageUrl: data.existingDeedBackImageUrl,
          existingInheritanceImageUrl: data.existingInheritanceImageUrl,
          existingHeirsPoaImageUrl: data.existingHeirsPoaImageUrl,
          existingEndowmentCertImageUrl: data.existingEndowmentCertImageUrl,
          existingTrusteeshipImageUrl: data.existingTrusteeshipImageUrl,
          existingGuardiansPoaImageUrl: data.existingGuardiansPoaImageUrl,
          existingAddressImageUrl: data.existingAddressImageUrl,
          hasExistingPowerOfAttorney: data.hasExistingPowerOfAttorney,
          selectedDeedType: data.selectedDeedType,
          isMultipleTrusteeshipDeedCopy: data.isMultipleTrusteeshipDeedCopy,
          addressMethod: data.addressMethod,
          addressLinkUrl: data.addressLinkUrl,
          addressManual: data.addressManual,
          mapLocation: data.mapLocation,
          ownerData: data.ownerData,
          agentData: data.agentData,
          reviewData: data.reviewData,
          ownerPhaseIndex: 0,
          currentStep: "deed",
        });
      },
    }),
    {
      name: "aqdi-create-property-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        propertyId: state.propertyId,
        isEditMode: state.isEditMode,
        existingDeedImageUrl: state.existingDeedImageUrl,
        existingDeedFrontImageUrl: state.existingDeedFrontImageUrl,
        existingDeedBackImageUrl: state.existingDeedBackImageUrl,
        existingInheritanceImageUrl: state.existingInheritanceImageUrl,
        existingHeirsPoaImageUrl: state.existingHeirsPoaImageUrl,
        existingEndowmentCertImageUrl: state.existingEndowmentCertImageUrl,
        existingTrusteeshipImageUrl: state.existingTrusteeshipImageUrl,
        existingGuardiansPoaImageUrl: state.existingGuardiansPoaImageUrl,
        existingAddressImageUrl: state.existingAddressImageUrl,
        hasExistingPowerOfAttorney: state.hasExistingPowerOfAttorney,
        currentStep:
          state.currentStep === "success" ? "deed" : state.currentStep,
        selectedDeedType: state.selectedDeedType,
        deedPersistedFiles: state.deedPersistedFiles,
        deedFrontPersistedFiles: state.deedFrontPersistedFiles,
        deedBackPersistedFiles: state.deedBackPersistedFiles,
        deedInheritancePersistedFiles: state.deedInheritancePersistedFiles,
        deedHeirsPoaPersistedFiles: state.deedHeirsPoaPersistedFiles,
        deedEndowmentCertPersistedFiles: state.deedEndowmentCertPersistedFiles,
        deedTrusteeshipPersistedFiles: state.deedTrusteeshipPersistedFiles,
        isMultipleTrusteeshipDeedCopy: state.isMultipleTrusteeshipDeedCopy,
        deedGuardiansPoaPersistedFiles: state.deedGuardiansPoaPersistedFiles,
        addressMethod: state.addressMethod,
        addressPhotoPersistedFiles: state.addressPhotoPersistedFiles,
        addressLinkUrl: state.addressLinkUrl,
        addressManual: state.addressManual,
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
        state.addressManual = {
          ...EMPTY_MANUAL_NATIONAL_ADDRESS,
          ...state.addressManual,
        };

        if (state.currentStep === "success") {
          state.currentStep = "deed";
        }

        state.hydrateFilesFromPersisted();
      },
    },
  ),
);
