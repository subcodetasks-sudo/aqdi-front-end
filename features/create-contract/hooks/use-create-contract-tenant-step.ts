"use client";

import {
  isLeaseRenewalAmendmentsComplete,
  isLeaseRenewalBirthDateComplete,
  isTenantDataComplete,
} from "@/features/create-contract/types/tenant-step";
import {
  areRentedUnitsComplete,
  TENANT_STEP_PHASE_COUNT,
} from "@/features/create-contract/types/rented-unit-step";
import {
  updateContractTenantStatus,
  useCreateContractDraftStore,
} from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { TenantStatusOption } from "@/features/create-contract/types/tenant-step";
import { isLeaseRenewalContract } from "@/features/create-contract/utils/is-lease-renewal-contract";
import { isSubleaseContract } from "@/features/create-contract/utils/is-sublease-contract";

export const LEASE_RENEWAL_TENANT_PHASE_COUNT = 2;
export const SUBLEASE_TENANT_PHASE_COUNT = 1;

export function useCreateContractTenantStep() {
  const tenant = useCreateContractDraftStore((state) => state.tenant);
  const selectedDeedType = useCreateContractDraftStore(
    (state) => state.deed.selectedDeedType,
  );
  const contractStep1Data = useCreateContractDraftStore(
    (state) => state.contractStep1Data,
  );
  const setTenantPhaseIndex = useCreateContractDraftStore(
    (state) => state.setTenantPhaseIndex,
  );
  const setTenantData = useCreateContractDraftStore((state) => state.setTenantData);
  const setRentedUnits = useCreateContractDraftStore((state) => state.setRentedUnits);
  const setLeaseRenewalAddNotes = useCreateContractDraftStore(
    (state) => state.setLeaseRenewalAddNotes,
  );
  const setLeaseRenewalNotes = useCreateContractDraftStore(
    (state) => state.setLeaseRenewalNotes,
  );

  const skipOwnerState = {
    selectedDeedType,
    instrumentType: contractStep1Data?.instrument_type,
  };
  const isLeaseRenewal = isLeaseRenewalContract(skipOwnerState);
  const isSublease = isSubleaseContract(skipOwnerState);

  const phaseCount = isLeaseRenewal
    ? LEASE_RENEWAL_TENANT_PHASE_COUNT
    : isSublease
      ? SUBLEASE_TENANT_PHASE_COUNT
      : TENANT_STEP_PHASE_COUNT;

  // Sublease skips tenant identity and goes straight to rented-unit data.
  const currentPhaseIndex = isSublease ? 0 : tenant.currentPhaseIndex;

  const isLastPhase = currentPhaseIndex === phaseCount - 1;

  const canContinue = isLeaseRenewal
    ? tenant.currentPhaseIndex === 0
      ? isLeaseRenewalBirthDateComplete(tenant.tenantData.individual.birthDate)
      : isLeaseRenewalAmendmentsComplete({
          addNotes: tenant.leaseRenewalAddNotes,
          notes: tenant.leaseRenewalNotes,
        })
    : isSublease
      ? areRentedUnitsComplete(tenant.rentedUnits)
      : tenant.currentPhaseIndex === 0
        ? isTenantDataComplete(tenant.tenantData)
        : areRentedUnitsComplete(tenant.rentedUnits);

  function updateStatus(status: TenantStatusOption | "") {
    setTenantData(updateContractTenantStatus(tenant.tenantData, status));
  }

  function goToNextPhase() {
    if (isSublease) {
      return;
    }

    const maxPhaseIndex = phaseCount - 1;

    if (tenant.currentPhaseIndex < maxPhaseIndex) {
      setTenantPhaseIndex(tenant.currentPhaseIndex + 1);
    }
  }

  function goToPreviousPhase() {
    if (isSublease) {
      return;
    }

    if (tenant.currentPhaseIndex > 0) {
      setTenantPhaseIndex(tenant.currentPhaseIndex - 1);
    }
  }

  return {
    currentPhaseIndex,
    phaseCount,
    tenantData: tenant.tenantData,
    setTenantData,
    rentedUnits: tenant.rentedUnits,
    setRentedUnits,
    leaseRenewalAddNotes: tenant.leaseRenewalAddNotes,
    leaseRenewalNotes: tenant.leaseRenewalNotes,
    setLeaseRenewalAddNotes,
    setLeaseRenewalNotes,
    isLeaseRenewal,
    isSublease,
    updateStatus,
    canContinue,
    isLastPhase,
    goToNextPhase,
    goToPreviousPhase,
  };
}
