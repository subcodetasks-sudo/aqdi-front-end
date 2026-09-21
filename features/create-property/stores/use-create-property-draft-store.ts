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
  propertyDeedTypeIsAdversePossession,
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsWaqfOwner,
} from "@/features/create-property/types/deed-type";
import {
  DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION,
  type PropertyNationalAddressMethodId,
} from "@/features/create-property/types/national-address";
import {
  EMPTY_MANUAL_NATIONAL_ADDRESS,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";
import {
  EMPTY_MANUAL_DEED_ENTRY,
  type ManualDeedEntryData,
} from "@/features/shared/types/manual-deed-entry";
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
import {
  EMPTY_PROPERTY_DETAILS,
  type PropertyDetailsState,
} from "@/features/create-property/types/property-details";
import { isOwnerStepSkipped } from "@/features/create-property/utils/is-owner-step-skipped";

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
  existingPowerOfAttorneyImageUrl: string | null;
  hasExistingPowerOfAttorney: boolean;
  currentStep: CreatePropertyStep;
  skippingOwnerStep: boolean;
  selectedDeedType: PropertyDeedTypeId | "";
  propertyDetails: PropertyDetailsState;
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
  hasMinorHeirs: boolean;
  deedGuardiansPoaFiles: File[];
  deedGuardiansPoaPersistedFiles: PersistedFile[];
  useManualDeedEntry: boolean;
  manualDeedEntry: ManualDeedEntryData;
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
  skipOwnerToReview: () => void;
  clearSkippingOwnerStep: () => void;
  setSelectedDeedType: (value: PropertyDeedTypeId | "") => void;
  setPropertyDetails: (value: PropertyDetailsState) => void;
  setDeedFiles: (files: File[]) => Promise<void>;
  setDeedFrontFiles: (files: File[]) => Promise<void>;
  setDeedBackFiles: (files: File[]) => Promise<void>;
  setDeedInheritanceFiles: (files: File[]) => Promise<void>;
  setDeedHeirsPoaFiles: (files: File[]) => Promise<void>;
  setDeedEndowmentCertFiles: (files: File[]) => Promise<void>;
  setDeedTrusteeshipFiles: (files: File[]) => Promise<void>;
  setIsMultipleTrusteeshipDeedCopy: (value: boolean) => void;
  setHasMinorHeirs: (value: boolean) => void;
  setDeedGuardiansPoaFiles: (files: File[]) => Promise<void>;
  setUseManualDeedEntry: (value: boolean) => void;
  setManualDeedEntry: (value: ManualDeedEntryData) => void;
  setAddressMethod: (method: PropertyNationalAddressMethodId) => void;
  setAddressPhotoFiles: (files: File[]) => Promise<void>;
  setAddressLinkUrl: (url: string) => void;
  setAddressManual: (value: ManualNationalAddressData) => void;
  setMapLocation: (location: typeof DEFAULT_PROPERTY_NATIONAL_ADDRESS_LOCATION) => void;
  setOwnerPhaseIndex: (index: number) => void;
  setOwnerData: (data: PropertyOwnerDataState) => void;
  setAgentData: (data: PropertyAgentDataState) => void;
  setReviewData: (data: PropertyReviewDataState) => void;
  clearExistingFileUrl: (
    field:
      | "existingDeedImageUrl"
      | "existingDeedFrontImageUrl"
      | "existingDeedBackImageUrl"
      | "existingInheritanceImageUrl"
      | "existingHeirsPoaImageUrl"
      | "existingEndowmentCertImageUrl"
      | "existingTrusteeshipImageUrl"
      | "existingGuardiansPoaImageUrl"
      | "existingAddressImageUrl"
      | "existingPowerOfAttorneyImageUrl",
  ) => void;
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
    hasAgent:
      ownerData?.hasAgent === "yes" || ownerData?.hasAgent === "no"
        ? ownerData.hasAgent
        : "no",
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
    existingPowerOfAttorneyImageUrl: null as string | null,
    hasExistingPowerOfAttorney: false,
    currentStep: "deed" as CreatePropertyStep,
    skippingOwnerStep: false,
    selectedDeedType: "" as PropertyDeedTypeId | "",
    propertyDetails: { ...EMPTY_PROPERTY_DETAILS },
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
    hasMinorHeirs: false,
    deedGuardiansPoaFiles: [] as File[],
    deedGuardiansPoaPersistedFiles: [] as PersistedFile[],
    useManualDeedEntry: false,
    manualDeedEntry: { ...EMPTY_MANUAL_DEED_ENTRY },
    addressMethod: "link" as PropertyNationalAddressMethodId | "",
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
      setCurrentStep: (step) =>
        set({ currentStep: step, skippingOwnerStep: false }),
      goNextStep: () => {
        const index = CREATE_PROPERTY_STEPS.indexOf(get().currentStep);
        if (index < CREATE_PROPERTY_STEPS.length - 1) {
          set({
            currentStep: CREATE_PROPERTY_STEPS[index + 1],
            skippingOwnerStep: false,
          });
        }
      },
      goBackStep: () => {
        const state = get();

        if (
          state.currentStep === "review" &&
          isOwnerStepSkipped({ selectedDeedType: state.selectedDeedType })
        ) {
          set({ currentStep: "deed", skippingOwnerStep: false });
          return;
        }

        const index = CREATE_PROPERTY_STEPS.indexOf(state.currentStep);
        if (index > 0) {
          set({
            currentStep: CREATE_PROPERTY_STEPS[index - 1],
            skippingOwnerStep: false,
          });
        }
      },
      skipOwnerToReview: () => {
        set({ currentStep: "review", skippingOwnerStep: true });
      },
      clearSkippingOwnerStep: () => {
        set({ skippingOwnerStep: false });
      },
      setSelectedDeedType: (value) =>
        set((state) => {
          const prev = state.selectedDeedType;
          const typeChanged = prev !== value;
          const clearDeedImage = value === "" || typeChanged;
          const clearDeceased =
            value === "" ||
            (propertyDeedTypeIsDeceasedOwner(prev) &&
              !propertyDeedTypeIsDeceasedOwner(value));
          const clearWaqf =
            value === "" ||
            (propertyDeedTypeIsWaqfOwner(prev) &&
              !propertyDeedTypeIsWaqfOwner(value));
          // Guardians POA is used by deceased (minor heirs) and waqf flows.
          const clearGuardians = clearDeceased || clearWaqf;
          const clearStrongArgument =
            value === "" ||
            (propertyDeedTypeIsAdversePossession(prev) &&
              !propertyDeedTypeIsAdversePossession(value));

          return {
            selectedDeedType: value,
            deedFiles: clearDeedImage ? [] : state.deedFiles,
            deedPersistedFiles: clearDeedImage ? [] : state.deedPersistedFiles,
            deedFrontFiles: clearDeedImage ? [] : state.deedFrontFiles,
            deedFrontPersistedFiles: clearDeedImage
              ? []
              : state.deedFrontPersistedFiles,
            deedBackFiles: clearDeedImage ? [] : state.deedBackFiles,
            deedBackPersistedFiles: clearDeedImage
              ? []
              : state.deedBackPersistedFiles,
            existingDeedImageUrl: clearDeedImage
              ? null
              : state.existingDeedImageUrl,
            existingDeedFrontImageUrl: clearDeedImage
              ? null
              : state.existingDeedFrontImageUrl,
            existingDeedBackImageUrl: clearDeedImage
              ? null
              : state.existingDeedBackImageUrl,
            deedInheritanceFiles: clearDeceased
              ? []
              : state.deedInheritanceFiles,
            deedInheritancePersistedFiles: clearDeceased
              ? []
              : state.deedInheritancePersistedFiles,
            existingInheritanceImageUrl: clearDeceased
              ? null
              : state.existingInheritanceImageUrl,
            deedHeirsPoaFiles: clearDeceased ? [] : state.deedHeirsPoaFiles,
            deedHeirsPoaPersistedFiles: clearDeceased
              ? []
              : state.deedHeirsPoaPersistedFiles,
            existingHeirsPoaImageUrl: clearDeceased
              ? null
              : state.existingHeirsPoaImageUrl,
            hasMinorHeirs: clearDeceased ? false : state.hasMinorHeirs,
            deedGuardiansPoaFiles: clearGuardians
              ? []
              : state.deedGuardiansPoaFiles,
            deedGuardiansPoaPersistedFiles: clearGuardians
              ? []
              : state.deedGuardiansPoaPersistedFiles,
            existingGuardiansPoaImageUrl: clearGuardians
              ? null
              : state.existingGuardiansPoaImageUrl,
            deedEndowmentCertFiles: clearWaqf
              ? []
              : state.deedEndowmentCertFiles,
            deedEndowmentCertPersistedFiles: clearWaqf
              ? []
              : state.deedEndowmentCertPersistedFiles,
            existingEndowmentCertImageUrl: clearWaqf
              ? null
              : state.existingEndowmentCertImageUrl,
            deedTrusteeshipFiles: clearWaqf ? [] : state.deedTrusteeshipFiles,
            deedTrusteeshipPersistedFiles: clearWaqf
              ? []
              : state.deedTrusteeshipPersistedFiles,
            existingTrusteeshipImageUrl: clearWaqf
              ? null
              : state.existingTrusteeshipImageUrl,
            isMultipleTrusteeshipDeedCopy: clearWaqf
              ? false
              : state.isMultipleTrusteeshipDeedCopy,
            useManualDeedEntry: clearDeedImage
              ? false
              : state.useManualDeedEntry,
            manualDeedEntry: clearDeedImage
              ? { ...EMPTY_MANUAL_DEED_ENTRY }
              : state.manualDeedEntry,
            propertyDetails: clearStrongArgument
              ? {
                  ...state.propertyDetails,
                  realEstateRegistryNumber: "",
                  typeDateFirstRegistration: "hijri" as const,
                  dateFirstRegistrationDay: "",
                  dateFirstRegistrationMonth: "",
                  dateFirstRegistrationYear: "",
                }
              : state.propertyDetails,
          };
        }),
      setPropertyDetails: (value) => set({ propertyDetails: value }),
      setDeedFiles: async (files) => {
        // Keep File objects in memory immediately so submit never races the
        // async persist step (large PDFs can take a moment to data-URL encode).
        set((state) => ({
          deedFiles: files,
          useManualDeedEntry: files.length > 0 ? false : state.useManualDeedEntry,
          manualDeedEntry:
            files.length > 0 ? { ...EMPTY_MANUAL_DEED_ENTRY } : state.manualDeedEntry,
        }));
        const deedPersistedFiles = await filesToPersisted(files);
        set({ deedPersistedFiles });
      },
      setDeedFrontFiles: async (files) => {
        set((state) => ({
          deedFrontFiles: files,
          useManualDeedEntry: files.length > 0 ? false : state.useManualDeedEntry,
          manualDeedEntry:
            files.length > 0 ? { ...EMPTY_MANUAL_DEED_ENTRY } : state.manualDeedEntry,
        }));
        const deedFrontPersistedFiles = await filesToPersisted(files);
        set({ deedFrontPersistedFiles });
      },
      setDeedBackFiles: async (files) => {
        set((state) => ({
          deedBackFiles: files,
          useManualDeedEntry: files.length > 0 ? false : state.useManualDeedEntry,
          manualDeedEntry:
            files.length > 0 ? { ...EMPTY_MANUAL_DEED_ENTRY } : state.manualDeedEntry,
        }));
        const deedBackPersistedFiles = await filesToPersisted(files);
        set({ deedBackPersistedFiles });
      },
      setDeedInheritanceFiles: async (files) => {
        set({ deedInheritanceFiles: files });
        const deedInheritancePersistedFiles = await filesToPersisted(files);
        set({ deedInheritancePersistedFiles });
      },
      setDeedHeirsPoaFiles: async (files) => {
        set({ deedHeirsPoaFiles: files });
        const deedHeirsPoaPersistedFiles = await filesToPersisted(files);
        set({ deedHeirsPoaPersistedFiles });
      },
      setDeedGuardiansPoaFiles: async (files) => {
        set({ deedGuardiansPoaFiles: files });
        const deedGuardiansPoaPersistedFiles = await filesToPersisted(files);
        set({ deedGuardiansPoaPersistedFiles });
      },
      setDeedEndowmentCertFiles: async (files) => {
        set({ deedEndowmentCertFiles: files });
        const deedEndowmentCertPersistedFiles = await filesToPersisted(files);
        set({ deedEndowmentCertPersistedFiles });
      },
      setDeedTrusteeshipFiles: async (files) => {
        set({ deedTrusteeshipFiles: files });
        const deedTrusteeshipPersistedFiles = await filesToPersisted(files);
        set({ deedTrusteeshipPersistedFiles });
      },
      setIsMultipleTrusteeshipDeedCopy: (value) =>
        set((state) => ({
          isMultipleTrusteeshipDeedCopy: value,
          deedGuardiansPoaFiles: value ? state.deedGuardiansPoaFiles : [],
          deedGuardiansPoaPersistedFiles: value
            ? state.deedGuardiansPoaPersistedFiles
            : [],
          existingGuardiansPoaImageUrl: value
            ? state.existingGuardiansPoaImageUrl
            : null,
        })),
      setHasMinorHeirs: (value) =>
        set((state) => ({
          hasMinorHeirs: value,
          deedGuardiansPoaFiles: value ? state.deedGuardiansPoaFiles : [],
          deedGuardiansPoaPersistedFiles: value
            ? state.deedGuardiansPoaPersistedFiles
            : [],
          existingGuardiansPoaImageUrl: value
            ? state.existingGuardiansPoaImageUrl
            : null,
        })),
      setUseManualDeedEntry: (value) =>
        set((state) => ({
          useManualDeedEntry: value,
          deedFiles: value ? [] : state.deedFiles,
          deedPersistedFiles: value ? [] : state.deedPersistedFiles,
          deedFrontFiles: value ? [] : state.deedFrontFiles,
          deedFrontPersistedFiles: value ? [] : state.deedFrontPersistedFiles,
          deedBackFiles: value ? [] : state.deedBackFiles,
          deedBackPersistedFiles: value ? [] : state.deedBackPersistedFiles,
          existingDeedImageUrl: value ? null : state.existingDeedImageUrl,
          existingDeedFrontImageUrl: value
            ? null
            : state.existingDeedFrontImageUrl,
          existingDeedBackImageUrl: value ? null : state.existingDeedBackImageUrl,
          manualDeedEntry: value
            ? state.manualDeedEntry
            : { ...EMPTY_MANUAL_DEED_ENTRY },
        })),
      setManualDeedEntry: (value) => set({ manualDeedEntry: value }),
      setAddressMethod: (method) => set({ addressMethod: method }),
      setAddressPhotoFiles: async (files) => {
        set({ addressPhotoFiles: files });
        const addressPhotoPersistedFiles = await filesToPersisted(files);
        set({ addressPhotoPersistedFiles });
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
      clearExistingFileUrl: (field) =>
        set({
          [field]: null,
          ...(field === "existingPowerOfAttorneyImageUrl"
            ? { hasExistingPowerOfAttorney: false }
            : {}),
        }),
      resetDraft: () => {
        localStorage.removeItem("aqdi-create-property-draft");
        set(createInitialPropertyDraft());
      },
      initializeNewSession: () => {
        localStorage.removeItem("aqdi-create-property-draft");
        set(createInitialPropertyDraft());
      },
      hydrateFilesFromPersisted: () => {
        const state = get();
        // Prefer in-memory Files (e.g. large uploads skipped by persist) so a
        // remount/hydrator pass never wipes attachments already selected.
        set({
          deedFiles:
            state.deedFiles.length > 0
              ? state.deedFiles
              : persistedToFiles(state.deedPersistedFiles),
          deedFrontFiles:
            state.deedFrontFiles.length > 0
              ? state.deedFrontFiles
              : persistedToFiles(state.deedFrontPersistedFiles),
          deedBackFiles:
            state.deedBackFiles.length > 0
              ? state.deedBackFiles
              : persistedToFiles(state.deedBackPersistedFiles),
          deedInheritanceFiles:
            state.deedInheritanceFiles.length > 0
              ? state.deedInheritanceFiles
              : persistedToFiles(state.deedInheritancePersistedFiles),
          deedHeirsPoaFiles:
            state.deedHeirsPoaFiles.length > 0
              ? state.deedHeirsPoaFiles
              : persistedToFiles(state.deedHeirsPoaPersistedFiles),
          deedEndowmentCertFiles:
            state.deedEndowmentCertFiles.length > 0
              ? state.deedEndowmentCertFiles
              : persistedToFiles(state.deedEndowmentCertPersistedFiles),
          deedTrusteeshipFiles:
            state.deedTrusteeshipFiles.length > 0
              ? state.deedTrusteeshipFiles
              : persistedToFiles(state.deedTrusteeshipPersistedFiles),
          deedGuardiansPoaFiles:
            state.deedGuardiansPoaFiles.length > 0
              ? state.deedGuardiansPoaFiles
              : persistedToFiles(state.deedGuardiansPoaPersistedFiles),
          addressPhotoFiles:
            state.addressPhotoFiles.length > 0
              ? state.addressPhotoFiles
              : persistedToFiles(state.addressPhotoPersistedFiles),
          agentData: {
            ...state.agentData,
            powerOfAttorneyFiles:
              state.agentData.powerOfAttorneyFiles.length > 0
                ? state.agentData.powerOfAttorneyFiles
                : persistedToFiles(state.agentPersistedFiles),
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
          existingPowerOfAttorneyImageUrl: data.existingPowerOfAttorneyImageUrl,
          hasExistingPowerOfAttorney: data.hasExistingPowerOfAttorney,
          selectedDeedType: data.selectedDeedType,
          propertyDetails: data.propertyDetails,
          isMultipleTrusteeshipDeedCopy: data.isMultipleTrusteeshipDeedCopy,
          hasMinorHeirs: Boolean(data.existingGuardiansPoaImageUrl),
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
        existingPowerOfAttorneyImageUrl: state.existingPowerOfAttorneyImageUrl,
        hasExistingPowerOfAttorney: state.hasExistingPowerOfAttorney,
        currentStep:
          state.currentStep === "success" ||
          (state.currentStep as string) === "address"
            ? "deed"
            : state.currentStep,
        selectedDeedType: state.selectedDeedType,
        propertyDetails: state.propertyDetails,
        deedPersistedFiles: state.deedPersistedFiles,
        deedFrontPersistedFiles: state.deedFrontPersistedFiles,
        deedBackPersistedFiles: state.deedBackPersistedFiles,
        deedInheritancePersistedFiles: state.deedInheritancePersistedFiles,
        deedHeirsPoaPersistedFiles: state.deedHeirsPoaPersistedFiles,
        deedEndowmentCertPersistedFiles: state.deedEndowmentCertPersistedFiles,
        deedTrusteeshipPersistedFiles: state.deedTrusteeshipPersistedFiles,
        isMultipleTrusteeshipDeedCopy: state.isMultipleTrusteeshipDeedCopy,
        hasMinorHeirs: state.hasMinorHeirs,
        deedGuardiansPoaPersistedFiles: state.deedGuardiansPoaPersistedFiles,
        useManualDeedEntry: state.useManualDeedEntry,
        manualDeedEntry: state.manualDeedEntry,
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
        state.propertyDetails = {
          ...EMPTY_PROPERTY_DETAILS,
          ...state.propertyDetails,
        };

        if (
          state.currentStep === "success" ||
          (state.currentStep as string) === "address"
        ) {
          state.currentStep = "deed";
        }

        state.hydrateFilesFromPersisted();
      },
    },
  ),
);
