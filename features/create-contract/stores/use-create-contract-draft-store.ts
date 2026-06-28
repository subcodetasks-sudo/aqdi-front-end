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
  EMPTY_FINANCE_DATA,
  type FinanceDataState,
  type TenantPermissionsState,
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

type DeedDraftState = {
  currentPhaseIndex: number;
  selectedDeedType: DeedTypeId | "";
  deedFiles: File[];
  deedPersistedFiles: PersistedFile[];
  nationalAddressMethod: NationalAddressMethodId;
  nationalAddressPhotoFiles: File[];
  nationalAddressPhotoPersistedFiles: PersistedFile[];
  nationalAddressLinkUrl: string;
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
  setNationalAddressMethod: (method: NationalAddressMethodId) => void;
  setNationalAddressPhotoFiles: (files: File[]) => Promise<void>;
  setNationalAddressLinkUrl: (url: string) => void;
  setOwnerPhaseIndex: (index: number) => void;
  setOwnerData: (data: OwnerDataState) => void;
  setAgentData: (data: AgentDataState) => void;
  setTenantPhaseIndex: (index: number) => void;
  setTenantData: (data: TenantDataState) => void;
  setRentedUnitData: (data: RentedUnitDataState) => void;
  setFinanceData: (
    data: FinanceDataState | ((current: FinanceDataState) => FinanceDataState),
  ) => void;
  saveTenantPermissions: (permissions: TenantPermissionsState) => void;
  saveOtherConditions: (text: string) => void;
  setPaymentData: (data: PaymentDataState) => void;
  resetDraft: () => void;
  hydrateFilesFromPersisted: () => void;
};

const INITIAL_DEED: DeedDraftState = {
  currentPhaseIndex: 0,
  selectedDeedType: "",
  deedFiles: [],
  deedPersistedFiles: [],
  nationalAddressMethod: "map",
  nationalAddressPhotoFiles: [],
  nationalAddressPhotoPersistedFiles: [],
  nationalAddressLinkUrl: "",
};

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
    deed: { ...INITIAL_DEED },
    owner: { ...INITIAL_OWNER, ownerData: { ...EMPTY_OWNER_DATA }, agentData: { ...EMPTY_AGENT_DATA } },
    tenant: {
      ...INITIAL_TENANT,
      tenantData: { ...EMPTY_TENANT_DATA, individual: { ...EMPTY_TENANT_DATA.individual }, organization: { ...EMPTY_TENANT_DATA.organization } },
      rentedUnitData: { ...EMPTY_RENTED_UNIT_DATA },
    },
    financeData: { ...EMPTY_FINANCE_DATA, tenantPermissions: { ...EMPTY_FINANCE_DATA.tenantPermissions } },
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
        set((state) => ({
          deed: {
            ...state.deed,
            selectedDeedType: value,
            deedFiles: value === "" ? [] : state.deed.deedFiles,
            deedPersistedFiles: value === "" ? [] : state.deed.deedPersistedFiles,
          },
        })),
      setDeedFiles: async (files) => {
        const deedPersistedFiles = await filesToPersisted(files);
        set((state) => ({
          deed: { ...state.deed, deedFiles: files, deedPersistedFiles },
        }));
      },
      setNationalAddressMethod: (method) =>
        set((state) => ({
          deed: { ...state.deed, nationalAddressMethod: method },
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
      saveTenantPermissions: (tenantPermissions) => {
        const hasAnyPermission = Object.values(tenantPermissions).some(Boolean);
        get().setFinanceData((current) => ({
          ...current,
          tenantPermissions,
          addTenantPermissions: hasAnyPermission,
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
      resetDraft: () => set(createInitialState()),
      hydrateFilesFromPersisted: () => {
        const state = get();
        set({
          deed: {
            ...state.deed,
            deedFiles: persistedToFiles(state.deed.deedPersistedFiles),
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
        deed: {
          currentPhaseIndex: state.deed.currentPhaseIndex,
          selectedDeedType: state.deed.selectedDeedType,
          deedPersistedFiles: state.deed.deedPersistedFiles,
          nationalAddressMethod: state.deed.nationalAddressMethod,
          nationalAddressPhotoPersistedFiles:
            state.deed.nationalAddressPhotoPersistedFiles,
          nationalAddressLinkUrl: state.deed.nationalAddressLinkUrl,
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
      onRehydrateStorage: () => (state) => {
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
