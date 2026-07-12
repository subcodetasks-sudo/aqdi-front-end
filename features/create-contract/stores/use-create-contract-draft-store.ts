"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  filesToPersisted,
  persistedToFiles,
  type PersistedFile,
} from "@/lib/storage/persisted-files";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type { NationalAddressMethodId } from "@/features/create-contract/types/national-address";
import {
  DEFAULT_NATIONAL_ADDRESS_LOCATION,
  type NationalAddressMapLocation,
} from "@/features/create-contract/types/national-address";
import {
  EMPTY_MANUAL_NATIONAL_ADDRESS,
  type ManualNationalAddressData,
} from "@/features/shared/types/manual-national-address";
import {
  EMPTY_FINANCE_DATA,
  normalizeFinanceData,
  type FinanceDataState,
} from "@/features/create-contract/types/finance-step";
import {
  EMPTY_PAYMENT_DATA,
  type PaymentDataState,
} from "@/features/create-contract/types/payment-step";
import {
  EMPTY_AGENT_DATA,
  EMPTY_OWNER_DATA,
  type AgentDataState,
  type OwnerDataState,
} from "@/features/create-contract/types/owner-step";
import {
  EMPTY_RENTED_UNIT_DATA,
  type RentedUnitDataState,
} from "@/features/create-contract/types/rented-unit-step";
import {
  CREATE_CONTRACT_STEPS,
  type CreateContractStep,
} from "@/features/create-contract/types/create-contract-step";
import {
  EMPTY_TENANT_DATA,
  type TenantDataState,
  type TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";
import type {
  ContractSession,
  ExistingPropertyContractContext,
  ExistingPropertyContractSession,
  FreshContractSession,
} from "@/features/create-contract/types/contract-session";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { ContractStep1ApiData } from "@/features/create-contract/types/contract-step1-api";
import type { ContractStep2ApiData } from "@/features/create-contract/types/contract-step2-api";
import type { ContractStep3ApiData } from "@/features/create-contract/types/contract-step3-api";
import type { ContractStep4ApiData } from "@/features/create-contract/types/contract-step4-api";
import type { ContractStep5ApiData } from "@/features/create-contract/types/contract-step5-api";
import type { ContractStep6ApiData } from "@/features/create-contract/types/contract-step6-api";
import { mapDeedTypeToInstrumentType } from "@/features/create-contract/utils/map-deed-type-to-instrument-type";
import { mapInstrumentTypeToDeedType } from "@/features/create-contract/utils/map-instrument-type-to-deed-type";
import {
  buildContractAgentData,
  buildContractOwnerData,
  buildRentedUnitData,
} from "@/features/create-contract/utils/build-existing-contract-draft";
import {
  buildAgentDataFromStep3,
  buildOwnerDataFromStep3,
  mapBackendStepToWizardStep,
} from "@/features/create-contract/utils/build-uncompleted-contract-draft";
import type { UncompletedContractData } from "@/features/create-contract/types/uncompleted-contract";

type DeedDraftState = {
  currentPhaseIndex: number;
  selectedDeedType: DeedTypeId | "";
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
  nationalAddressMethod: NationalAddressMethodId;
  nationalAddressPhotoFiles: File[];
  nationalAddressPhotoPersistedFiles: PersistedFile[];
  nationalAddressLinkUrl: string;
  nationalAddressManual: ManualNationalAddressData;
  mapLocation: NationalAddressMapLocation;
};

type OwnerDraftState = {
  currentPhaseIndex: number;
  ownerData: OwnerDataState;
  agentData: AgentDataState;
  agentPersistedFiles: PersistedFile[];
};

type TenantDraftState = {
  currentPhaseIndex: number;
  tenantData: TenantDataState;
  tenantPersistedFiles: PersistedFile[];
  rentedUnitData: RentedUnitDataState;
};

type CreateContractDraftStore = {
  currentStep: CreateContractStep;
  contractSession: ContractSession | null;
  contractStep1Data: ContractStep1ApiData | null;
  contractStep2Data: ContractStep2ApiData | null;
  contractStep3Data: ContractStep3ApiData | null;
  contractStep4Data: ContractStep4ApiData | null;
  contractStep5Data: ContractStep5ApiData | null;
  contractStep6Data: ContractStep6ApiData | null;
  existingPropertyContext: ExistingPropertyContractContext | null;
  deed: DeedDraftState;
  owner: OwnerDraftState;
  tenant: TenantDraftState;
  financeData: FinanceDataState;
  paymentData: PaymentDataState;
  setCurrentStep: (step: CreateContractStep) => void;
  goNextStep: () => void;
  goBackStep: () => void;
  setDeedPhaseIndex: (index: number) => void;
  setSelectedDeedType: (value: DeedTypeId | "") => void;
  setDeedFiles: (files: File[]) => Promise<void>;
  setDeedFrontFiles: (files: File[]) => Promise<void>;
  setDeedBackFiles: (files: File[]) => Promise<void>;
  setDeedInheritanceFiles: (files: File[]) => Promise<void>;
  setDeedHeirsPoaFiles: (files: File[]) => Promise<void>;
  setDeedEndowmentCertFiles: (files: File[]) => Promise<void>;
  setDeedTrusteeshipFiles: (files: File[]) => Promise<void>;
  setIsMultipleTrusteeshipDeedCopy: (value: boolean) => void;
  setDeedGuardiansPoaFiles: (files: File[]) => Promise<void>;
  setNationalAddressMethod: (method: NationalAddressMethodId) => void;
  setNationalAddressPhotoFiles: (files: File[]) => Promise<void>;
  setNationalAddressLinkUrl: (url: string) => void;
  setNationalAddressManual: (value: ManualNationalAddressData) => void;
  setMapLocation: (location: NationalAddressMapLocation) => void;
  setOwnerPhaseIndex: (index: number) => void;
  setOwnerData: (data: OwnerDataState) => void;
  setAgentData: (data: AgentDataState) => void;
  setTenantPhaseIndex: (index: number) => void;
  setTenantData: (data: TenantDataState) => void;
  setRentedUnitData: (data: RentedUnitDataState) => void;
  setFinanceData: (
    data: FinanceDataState | ((current: FinanceDataState) => FinanceDataState),
  ) => void;
  saveTenantRoles: (roleIds: number[]) => void;
  saveOtherConditions: (text: string) => void;
  setPaymentData: (data: PaymentDataState) => void;
  setFreshContractSession: (session: FreshContractSession) => void;
  setContractStep1Data: (data: ContractStep1ApiData | null) => void;
  setContractStep2Data: (data: ContractStep2ApiData | null) => void;
  setContractStep3Data: (data: ContractStep3ApiData | null) => void;
  setContractStep4Data: (data: ContractStep4ApiData | null) => void;
  setContractStep5Data: (data: ContractStep5ApiData | null) => void;
  setContractStep6Data: (data: ContractStep6ApiData | null) => void;
  startExistingPropertyContractFlow: (payload: {
    session: ExistingPropertyContractSession;
    context: ExistingPropertyContractContext;
  }) => void;
  loadUncompletedContract: (data: UncompletedContractData) => void;
  resetDraft: () => void;
  hydrateFilesFromPersisted: () => void;
};

const INITIAL_DEED: DeedDraftState = {
  currentPhaseIndex: 0,
  selectedDeedType: "",
  deedFiles: [],
  deedPersistedFiles: [],
  deedFrontFiles: [],
  deedFrontPersistedFiles: [],
  deedBackFiles: [],
  deedBackPersistedFiles: [],
  deedInheritanceFiles: [],
  deedInheritancePersistedFiles: [],
  deedHeirsPoaFiles: [],
  deedHeirsPoaPersistedFiles: [],
  deedEndowmentCertFiles: [],
  deedEndowmentCertPersistedFiles: [],
  deedTrusteeshipFiles: [],
  deedTrusteeshipPersistedFiles: [],
  isMultipleTrusteeshipDeedCopy: false,
  deedGuardiansPoaFiles: [],
  deedGuardiansPoaPersistedFiles: [],
  nationalAddressMethod: "map",
  nationalAddressPhotoFiles: [],
  nationalAddressPhotoPersistedFiles: [],
  nationalAddressLinkUrl: "",
  nationalAddressManual: { ...EMPTY_MANUAL_NATIONAL_ADDRESS },
  mapLocation: DEFAULT_NATIONAL_ADDRESS_LOCATION,
};

function parseMapLocation(
  latitude: string | null,
  longitude: string | null,
): NationalAddressMapLocation {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    return { lat, lng };
  }

  return DEFAULT_NATIONAL_ADDRESS_LOCATION;
}

function buildDeedDraftFromProperty(
  property: ExistingPropertyContractContext["property"],
): DeedDraftState {
  const addressUrl = property.address_url?.trim() ?? "";
  const nationalAddressMethod: NationalAddressMethodId = addressUrl
    ? /^https?:\/\//i.test(addressUrl)
      ? "link"
      : "manual"
    : property.image_address
      ? "photo"
      : "map";

  return {
    ...INITIAL_DEED,
    selectedDeedType: mapInstrumentTypeToDeedType(property.instrument_type),
    nationalAddressMethod,
    nationalAddressLinkUrl: addressUrl,
    mapLocation: parseMapLocation(property.latitude, property.longitude),
  };
}

function buildDeedDraftFromUncompleted(
  data: UncompletedContractData,
): DeedDraftState {
  const step1 = data.step1;
  const step2 = data.step2;
  const addressUrl = (
    step2?.address_url ??
    step1?.address_url ??
    ""
  ).trim();
  const imageAddress = step2?.image_address ?? null;

  const nationalAddressMethod: NationalAddressMethodId = addressUrl
    ? /^https?:\/\//i.test(addressUrl)
      ? "link"
      : "manual"
    : imageAddress
      ? "photo"
      : "map";

  const latitude = step2?.latitude ?? step1?.latitude ?? null;
  const longitude = step2?.longitude ?? step1?.longitude ?? null;

  return {
    ...INITIAL_DEED,
    selectedDeedType: mapInstrumentTypeToDeedType(step1?.instrument_type),
    nationalAddressMethod,
    nationalAddressLinkUrl: addressUrl,
    mapLocation: parseMapLocation(
      latitude === null ? null : String(latitude),
      longitude === null ? null : String(longitude),
    ),
    isMultipleTrusteeshipDeedCopy: Boolean(step1?.is_multiple_trusteeship_deed_copy),
  };
}

function buildStep1DataFromUncompleted(
  data: UncompletedContractData,
): ContractStep1ApiData | null {
  const step1 = data.step1;

  if (!step1) {
    return null;
  }

  return {
    id: step1.id,
    contract_id: step1.contract_id,
    uuid: step1.uuid,
    contract_type: step1.contract_type,
    contract_type_trans: step1.contract_type_trans,
    real_id: step1.real_id,
    real_units_id: step1.real_units_id,
    instrument_type: step1.instrument_type,
    instrument_type_trans: step1.instrument_type_trans,
    image_instrument: step1.image_instrument,
    image_instrument_from_the_front: step1.image_instrument_from_the_front,
    image_instrument_from_the_back: step1.image_instrument_from_the_back,
    Image_inheritance_certificate: step1.Image_inheritance_certificate,
    copy_power_of_attorney_from_heirs_to_agent:
      step1.copy_power_of_attorney_from_heirs_to_agent,
    copy_of_the_endowment_registration_certificate:
      step1.copy_of_the_endowment_registration_certificate,
    copy_of_the_trusteeship_deed: step1.copy_of_the_trusteeship_deed,
    is_multiple_trusteeship_deed_copy: step1.is_multiple_trusteeship_deed_copy,
    copy_of_guardians_power_of_attorney_for_agent:
      step1.copy_of_guardians_power_of_attorney_for_agent,
    latitude: step1.latitude === null ? null : String(step1.latitude),
    longitude: step1.longitude === null ? null : String(step1.longitude),
    lat: step1.lat === null ? null : String(step1.lat),
    lng: step1.lng === null ? null : String(step1.lng),
    address_url: step1.address_url,
    step: step1.step,
  };
}

function buildStep2DataFromUncompleted(
  data: UncompletedContractData,
): ContractStep2ApiData | null {
  const step2 = data.step2;

  if (!step2) {
    return null;
  }

  return {
    id: step2.id,
    contract_id: data.contract_id,
    uuid: step2.uuid,
    latitude: step2.latitude,
    longitude: step2.longitude,
    lat: step2.latitude,
    lng: step2.longitude,
    address_url: step2.address_url,
    image_address: step2.image_address,
    step: step2.step,
  };
}

function buildStep3DataFromUncompleted(
  data: UncompletedContractData,
): ContractStep3ApiData | null {
  const step3 = data.step3;

  if (!step3) {
    return null;
  }

  return {
    id: step3.id,
    contract_id: data.contract_id,
    uuid: step3.uuid,
    name_owner: step3.name_owner,
    property_owner_id_num: step3.property_owner_id_num,
    type_dob_property_owner: step3.type_dob_property_owner,
    property_owner_mobile: step3.property_owner_mobile,
    property_owner_iban: step3.property_owner_iban,
    add_legal_agent_of_owner: step3.add_legal_agent_of_owner,
    id_num_of_property_owner_agent: step3.id_num_of_property_owner_agent,
    mobile_of_property_owner_agent: step3.mobile_of_property_owner_agent,
    step: step3.step,
  };
}

const INITIAL_OWNER: OwnerDraftState = {
  currentPhaseIndex: 0,
  ownerData: EMPTY_OWNER_DATA,
  agentData: EMPTY_AGENT_DATA,
  agentPersistedFiles: [],
};

const INITIAL_TENANT: TenantDraftState = {
  currentPhaseIndex: 0,
  tenantData: EMPTY_TENANT_DATA,
  tenantPersistedFiles: [],
  rentedUnitData: EMPTY_RENTED_UNIT_DATA,
};

function createInitialState() {
  return {
    currentStep: "intro" as CreateContractStep,
    contractSession: null as ContractSession | null,
    contractStep1Data: null as ContractStep1ApiData | null,
    contractStep2Data: null as ContractStep2ApiData | null,
    contractStep3Data: null as ContractStep3ApiData | null,
    contractStep4Data: null as ContractStep4ApiData | null,
    contractStep5Data: null as ContractStep5ApiData | null,
    contractStep6Data: null as ContractStep6ApiData | null,
    existingPropertyContext: null as ExistingPropertyContractContext | null,
    deed: { ...INITIAL_DEED },
    owner: { ...INITIAL_OWNER, ownerData: { ...EMPTY_OWNER_DATA }, agentData: { ...EMPTY_AGENT_DATA } },
    tenant: {
      ...INITIAL_TENANT,
      tenantData: { ...EMPTY_TENANT_DATA, individual: { ...EMPTY_TENANT_DATA.individual }, organization: { ...EMPTY_TENANT_DATA.organization } },
      rentedUnitData: { ...EMPTY_RENTED_UNIT_DATA },
    },
    financeData: { ...EMPTY_FINANCE_DATA },
    paymentData: { ...EMPTY_PAYMENT_DATA },
  };
}

export const useCreateContractDraftStore = create<CreateContractDraftStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      setCurrentStep: (step) => set({ currentStep: step }),
      goNextStep: () => {
        const index = CREATE_CONTRACT_STEPS.indexOf(get().currentStep);
        if (index < CREATE_CONTRACT_STEPS.length - 1) {
          set({ currentStep: CREATE_CONTRACT_STEPS[index + 1] });
        }
      },
      goBackStep: () => {
        const index = CREATE_CONTRACT_STEPS.indexOf(get().currentStep);
        if (index > 0) {
          set({ currentStep: CREATE_CONTRACT_STEPS[index - 1] });
        }
      },
      setDeedPhaseIndex: (index) =>
        set((state) => ({ deed: { ...state.deed, currentPhaseIndex: index } })),
      setSelectedDeedType: (value) =>
        set((state) => {
          const nextInstrumentType =
            value === "" ? null : mapDeedTypeToInstrumentType(value);
          const shouldClearStep1 =
            state.contractStep1Data !== null &&
            nextInstrumentType !== state.contractStep1Data.instrument_type;

          return {
            deed: {
              ...state.deed,
              selectedDeedType: value,
              deedFiles: value === "" ? [] : state.deed.deedFiles,
              deedPersistedFiles: value === "" ? [] : state.deed.deedPersistedFiles,
              deedFrontFiles: value === "" ? [] : state.deed.deedFrontFiles,
              deedFrontPersistedFiles:
                value === "" ? [] : state.deed.deedFrontPersistedFiles,
              deedBackFiles: value === "" ? [] : state.deed.deedBackFiles,
              deedBackPersistedFiles:
                value === "" ? [] : state.deed.deedBackPersistedFiles,
              deedInheritanceFiles:
                value === "" ? [] : state.deed.deedInheritanceFiles,
              deedInheritancePersistedFiles:
                value === "" ? [] : state.deed.deedInheritancePersistedFiles,
              deedHeirsPoaFiles: value === "" ? [] : state.deed.deedHeirsPoaFiles,
              deedHeirsPoaPersistedFiles:
                value === "" ? [] : state.deed.deedHeirsPoaPersistedFiles,
              deedEndowmentCertFiles:
                value === "" ? [] : state.deed.deedEndowmentCertFiles,
              deedEndowmentCertPersistedFiles:
                value === "" ? [] : state.deed.deedEndowmentCertPersistedFiles,
              deedTrusteeshipFiles:
                value === "" ? [] : state.deed.deedTrusteeshipFiles,
              deedTrusteeshipPersistedFiles:
                value === "" ? [] : state.deed.deedTrusteeshipPersistedFiles,
              isMultipleTrusteeshipDeedCopy:
                value === "" ? false : state.deed.isMultipleTrusteeshipDeedCopy,
              deedGuardiansPoaFiles:
                value === "" ? [] : state.deed.deedGuardiansPoaFiles,
              deedGuardiansPoaPersistedFiles:
                value === "" ? [] : state.deed.deedGuardiansPoaPersistedFiles,
            },
            contractStep1Data: shouldClearStep1 ? null : state.contractStep1Data,
            contractStep2Data: shouldClearStep1 ? null : state.contractStep2Data,
          };
        }),
      setDeedFiles: async (files) => {
        const deedPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: { ...state.deed, deedFiles: files, deedPersistedFiles },
        }));
      },
      setDeedFrontFiles: async (files) => {
        const deedFrontPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: { ...state.deed, deedFrontFiles: files, deedFrontPersistedFiles },
        }));
      },
      setDeedBackFiles: async (files) => {
        const deedBackPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: { ...state.deed, deedBackFiles: files, deedBackPersistedFiles },
        }));
      },
      setDeedInheritanceFiles: async (files) => {
        const deedInheritancePersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: {
            ...state.deed,
            deedInheritanceFiles: files,
            deedInheritancePersistedFiles,
          },
        }));
      },
      setDeedHeirsPoaFiles: async (files) => {
        const deedHeirsPoaPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: {
            ...state.deed,
            deedHeirsPoaFiles: files,
            deedHeirsPoaPersistedFiles,
          },
        }));
      },
      setDeedEndowmentCertFiles: async (files) => {
        const deedEndowmentCertPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: {
            ...state.deed,
            deedEndowmentCertFiles: files,
            deedEndowmentCertPersistedFiles,
          },
        }));
      },
      setDeedTrusteeshipFiles: async (files) => {
        const deedTrusteeshipPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: {
            ...state.deed,
            deedTrusteeshipFiles: files,
            deedTrusteeshipPersistedFiles,
          },
        }));
      },
      setIsMultipleTrusteeshipDeedCopy: (value) =>
        set((state) => ({
          deed: {
            ...state.deed,
            isMultipleTrusteeshipDeedCopy: value,
            deedGuardiansPoaFiles: value ? state.deed.deedGuardiansPoaFiles : [],
            deedGuardiansPoaPersistedFiles: value
              ? state.deed.deedGuardiansPoaPersistedFiles
              : [],
          },
        })),
      setDeedGuardiansPoaFiles: async (files) => {
        const deedGuardiansPoaPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: {
            ...state.deed,
            deedGuardiansPoaFiles: files,
            deedGuardiansPoaPersistedFiles,
          },
        }));
      },
      setNationalAddressMethod: (method) =>
        set((state) => ({
          deed: { ...state.deed, nationalAddressMethod: method },
          contractStep2Data:
            state.deed.nationalAddressMethod === method ? state.contractStep2Data : null,
        })),
      setNationalAddressPhotoFiles: async (files) => {
        const nationalAddressPhotoPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: {
            ...state.deed,
            nationalAddressPhotoFiles: files,
            nationalAddressPhotoPersistedFiles,
          },
        }));
      },
      setNationalAddressLinkUrl: (url) =>
        set((state) => ({
          deed: { ...state.deed, nationalAddressLinkUrl: url },
        })),
      setNationalAddressManual: (value) =>
        set((state) => ({
          deed: { ...state.deed, nationalAddressManual: value },
        })),
      setMapLocation: (location) =>
        set((state) => {
          const hasLocationChanged =
            state.deed.mapLocation?.lat !== location.lat ||
            state.deed.mapLocation?.lng !== location.lng;

          return {
            deed: { ...state.deed, mapLocation: location },
            contractStep2Data: hasLocationChanged ? null : state.contractStep2Data,
          };
        }),
      setOwnerPhaseIndex: (index) =>
        set((state) => ({ owner: { ...state.owner, currentPhaseIndex: index } })),
      setOwnerData: (data) =>
        set((state) => {
          const resetAgent =
            data.hasAgent === "no" && state.owner.ownerData.hasAgent === "yes";

          return {
            owner: {
              ...state.owner,
              ownerData: data,
              agentData: resetAgent ? { ...EMPTY_AGENT_DATA } : state.owner.agentData,
              agentPersistedFiles: resetAgent ? [] : state.owner.agentPersistedFiles,
            },
          };
        }),
      setAgentData: (data) => {
        void filesToPersisted(data.powerOfAttorneyFiles).then((agentPersistedFiles) => {
          set((state) => ({
            owner: {
              ...state.owner,
              agentData: data,
              agentPersistedFiles,
            },
          }));
        });
      },
      setTenantPhaseIndex: (index) =>
        set((state) => ({ tenant: { ...state.tenant, currentPhaseIndex: index } })),
      setTenantData: (data) => {
        void filesToPersisted(data.organization.powerOfAttorneyFiles).then(
          (tenantPersistedFiles) => {
            set((state) => ({
              tenant: {
                ...state.tenant,
                tenantData: data,
                tenantPersistedFiles,
              },
            }));
          },
        );
      },
      setRentedUnitData: (data) =>
        set((state) => ({ tenant: { ...state.tenant, rentedUnitData: data } })),
      setFinanceData: (data) =>
        set((state) => ({
          financeData:
            typeof data === "function" ? data(state.financeData) : data,
        })),
      saveTenantRoles: (selectedTenantRoleIds) => {
        get().setFinanceData((current) => ({
          ...current,
          selectedTenantRoleIds,
          addTenantPermissions: selectedTenantRoleIds.length > 0,
        }));
      },
      saveOtherConditions: (otherConditionsText) => {
        get().setFinanceData((current) => ({
          ...current,
          otherConditionsText,
          addOtherConditions: otherConditionsText.trim().length > 0,
        }));
      },
      setPaymentData: (data) => set({ paymentData: data }),
      setFreshContractSession: (session) =>
        set((state) => ({
          contractSession: session,
          contractStep1Data:
            state.contractSession?.contractId === session.contractId
              ? state.contractStep1Data
              : null,
          contractStep2Data:
            state.contractSession?.contractId === session.contractId
              ? state.contractStep2Data
              : null,
          contractStep3Data:
            state.contractSession?.contractId === session.contractId
              ? state.contractStep3Data
              : null,
          contractStep4Data:
            state.contractSession?.contractId === session.contractId
              ? state.contractStep4Data
              : null,
          contractStep5Data:
            state.contractSession?.contractId === session.contractId
              ? state.contractStep5Data
              : null,
          contractStep6Data:
            state.contractSession?.contractId === session.contractId
              ? state.contractStep6Data
              : null,
        })),
      setContractStep1Data: (data) => set({ contractStep1Data: data }),
      setContractStep2Data: (data) => set({ contractStep2Data: data }),
      setContractStep3Data: (data) => set({ contractStep3Data: data }),
      setContractStep4Data: (data) => set({ contractStep4Data: data }),
      setContractStep5Data: (data) => set({ contractStep5Data: data }),
      setContractStep6Data: (data) => set({ contractStep6Data: data }),
      startExistingPropertyContractFlow: ({ session, context }) => {
        const base = createInitialState();

        set({
          ...base,
          currentStep: "deed",
          contractSession: session,
          existingPropertyContext: context,
          deed: buildDeedDraftFromProperty(context.property),
          owner: {
            ...base.owner,
            ownerData: buildContractOwnerData(context.property),
            agentData: buildContractAgentData(context.property),
          },
          tenant: {
            ...base.tenant,
            rentedUnitData: buildRentedUnitData(context.unit),
          },
        });
      },
      loadUncompletedContract: (data) => {
        const base = createInitialState();
        const contractType: PropertyContractType =
          data.step1?.contract_type === "commercial" ? "commercial" : "housing";
        const step3 = data.step3;

        set({
          ...base,
          currentStep: mapBackendStepToWizardStep(data.step),
          contractSession: {
            contractId: data.contract_id,
            uuid: data.uuid,
            contractType,
            isReal: false,
          },
          contractStep1Data: buildStep1DataFromUncompleted(data),
          contractStep2Data: buildStep2DataFromUncompleted(data),
          contractStep3Data: buildStep3DataFromUncompleted(data),
          deed: buildDeedDraftFromUncompleted(data),
          owner: {
            ...base.owner,
            ownerData: step3 ? buildOwnerDataFromStep3(step3) : base.owner.ownerData,
            agentData: step3 ? buildAgentDataFromStep3(step3) : base.owner.agentData,
          },
        });
      },
      resetDraft: () => set(createInitialState()),
      hydrateFilesFromPersisted: () => {
        const state = get();
        set({
          deed: {
            ...state.deed,
            deedFiles: persistedToFiles(state.deed.deedPersistedFiles),
            deedFrontFiles: persistedToFiles(state.deed.deedFrontPersistedFiles),
            deedBackFiles: persistedToFiles(state.deed.deedBackPersistedFiles),
            deedInheritanceFiles: persistedToFiles(
              state.deed.deedInheritancePersistedFiles,
            ),
            deedHeirsPoaFiles: persistedToFiles(
              state.deed.deedHeirsPoaPersistedFiles,
            ),
            deedEndowmentCertFiles: persistedToFiles(
              state.deed.deedEndowmentCertPersistedFiles,
            ),
            deedTrusteeshipFiles: persistedToFiles(
              state.deed.deedTrusteeshipPersistedFiles,
            ),
            deedGuardiansPoaFiles: persistedToFiles(
              state.deed.deedGuardiansPoaPersistedFiles,
            ),
            nationalAddressPhotoFiles: persistedToFiles(
              state.deed.nationalAddressPhotoPersistedFiles,
            ),
          },
          owner: {
            ...state.owner,
            agentData: {
              ...state.owner.agentData,
              powerOfAttorneyFiles: persistedToFiles(state.owner.agentPersistedFiles),
            },
          },
          tenant: {
            ...state.tenant,
            tenantData: {
              ...state.tenant.tenantData,
              organization: {
                ...state.tenant.tenantData.organization,
                powerOfAttorneyFiles: persistedToFiles(
                  state.tenant.tenantPersistedFiles,
                ),
              },
            },
          },
        });
      },
    }),
    {
      name: "aqdi-create-contract-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        contractSession: state.contractSession,
        contractStep1Data: state.contractStep1Data,
        contractStep2Data: state.contractStep2Data,
        contractStep3Data: state.contractStep3Data,
        contractStep4Data: state.contractStep4Data,
        contractStep5Data: state.contractStep5Data,
        contractStep6Data: state.contractStep6Data,
        existingPropertyContext: state.existingPropertyContext,
        deed: {
          currentPhaseIndex: state.deed.currentPhaseIndex,
          selectedDeedType: state.deed.selectedDeedType,
          deedPersistedFiles: state.deed.deedPersistedFiles,
          deedFrontPersistedFiles: state.deed.deedFrontPersistedFiles,
          deedBackPersistedFiles: state.deed.deedBackPersistedFiles,
          deedInheritancePersistedFiles: state.deed.deedInheritancePersistedFiles,
          deedHeirsPoaPersistedFiles: state.deed.deedHeirsPoaPersistedFiles,
          deedEndowmentCertPersistedFiles: state.deed.deedEndowmentCertPersistedFiles,
          deedTrusteeshipPersistedFiles: state.deed.deedTrusteeshipPersistedFiles,
          isMultipleTrusteeshipDeedCopy: state.deed.isMultipleTrusteeshipDeedCopy,
          deedGuardiansPoaPersistedFiles: state.deed.deedGuardiansPoaPersistedFiles,
          nationalAddressMethod: state.deed.nationalAddressMethod,
          nationalAddressPhotoPersistedFiles:
            state.deed.nationalAddressPhotoPersistedFiles,
          nationalAddressLinkUrl: state.deed.nationalAddressLinkUrl,
          nationalAddressManual: state.deed.nationalAddressManual,
          mapLocation: state.deed.mapLocation,
        },
        owner: {
          currentPhaseIndex: state.owner.currentPhaseIndex,
          ownerData: state.owner.ownerData,
          agentData: {
            idNumber: state.owner.agentData.idNumber,
            birthDate: state.owner.agentData.birthDate,
            phone: state.owner.agentData.phone,
            powerOfAttorneyFiles: [],
          },
          agentPersistedFiles: state.owner.agentPersistedFiles,
        },
        tenant: {
          currentPhaseIndex: state.tenant.currentPhaseIndex,
          tenantData: {
            status: state.tenant.tenantData.status,
            individual: state.tenant.tenantData.individual,
            organization: {
              delegationType: state.tenant.tenantData.organization.delegationType,
              unifiedRecordNumber:
                state.tenant.tenantData.organization.unifiedRecordNumber,
              ownerIdNumber: state.tenant.tenantData.organization.ownerIdNumber,
              ownerBirthDate: state.tenant.tenantData.organization.ownerBirthDate,
              ownerPhone: state.tenant.tenantData.organization.ownerPhone,
              powerOfAttorneyFiles: [],
            },
          },
          tenantPersistedFiles: state.tenant.tenantPersistedFiles,
          rentedUnitData: state.tenant.rentedUnitData,
        },
        financeData: state.financeData,
        paymentData: state.paymentData,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<CreateContractDraftStore>;
        const initial = createInitialState();

        const persistedOwner = (persisted.owner ?? {}) as Partial<
          CreateContractDraftStore["owner"]
        >;
        const persistedTenant = (persisted.tenant ?? {}) as Partial<
          CreateContractDraftStore["tenant"]
        >;
        const persistedTenantData = (persistedTenant.tenantData ?? {}) as Partial<
          CreateContractDraftStore["tenant"]["tenantData"]
        >;

        return {
          ...currentState,
          ...persisted,
          deed: { ...initial.deed, ...(persisted.deed ?? {}) },
          owner: {
            ...initial.owner,
            ...persistedOwner,
            ownerData: {
              ...initial.owner.ownerData,
              ...(persistedOwner.ownerData ?? {}),
            },
            agentData: {
              ...initial.owner.agentData,
              ...(persistedOwner.agentData ?? {}),
            },
          },
          tenant: {
            ...initial.tenant,
            ...persistedTenant,
            tenantData: {
              ...initial.tenant.tenantData,
              ...persistedTenantData,
              individual: {
                ...initial.tenant.tenantData.individual,
                ...(persistedTenantData.individual ?? {}),
              },
              organization: {
                ...initial.tenant.tenantData.organization,
                ...(persistedTenantData.organization ?? {}),
              },
            },
            rentedUnitData: {
              ...initial.tenant.rentedUnitData,
              ...(persistedTenant.rentedUnitData ?? {}),
            },
          },
          financeData: normalizeFinanceData({
            ...initial.financeData,
            ...(persisted.financeData ?? {}),
            contractPeriodId:
              typeof persisted.financeData?.contractPeriodId === "number"
                ? persisted.financeData.contractPeriodId
                : "",
          }),
          paymentData: { ...initial.paymentData, ...(persisted.paymentData ?? {}) },
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.financeData = normalizeFinanceData(state.financeData);
        }

        state?.hydrateFilesFromPersisted();
      },
    },
  ),
);

export function updateContractTenantStatus(
  tenantData: TenantDataState,
  status: TenantStatusOption | "",
): TenantDataState {
  return {
    status,
    individual:
      status === "individual"
        ? tenantData.individual
        : { ...EMPTY_TENANT_DATA.individual },
    organization:
      status === "establishment-or-company"
        ? tenantData.organization
        : { ...EMPTY_TENANT_DATA.organization, powerOfAttorneyFiles: [] },
  };
}
