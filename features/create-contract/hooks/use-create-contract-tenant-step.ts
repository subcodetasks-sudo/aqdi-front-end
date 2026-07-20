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

export const LEASE_RENEWAL_TENANT_PHASE_COUNT = 2;

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

  const isLeaseRenewal = isLeaseRenewalContract({
    selectedDeedType,
    instrumentType: contractStep1Data?.instrument_type,
  });

  const isLastPhase = isLeaseRenewal
    ? tenant.currentPhaseIndex === LEASE_RENEWAL_TENANT_PHASE_COUNT - 1
    : tenant.currentPhaseIndex === TENANT_STEP_PHASE_COUNT - 1;

  const canContinue = isLeaseRenewal
    ? tenant.currentPhaseIndex === 0
      ? isLeaseRenewalBirthDateComplete(tenant.tenantData.individual.birthDate)
      : isLeaseRenewalAmendmentsComplete({
          addNotes: tenant.leaseRenewalAddNotes,
          notes: tenant.leaseRenewalNotes,
        })
    : tenant.currentPhaseIndex === 0
      ? isTenantDataComplete(tenant.tenantData)
      : areRentedUnitsComplete(tenant.rentedUnits);

  function updateStatus(status: TenantStatusOption | "") {
    setTenantData(updateContractTenantStatus(tenant.tenantData, status));
  }

  function goToNextPhase() {
    const maxPhaseIndex = isLeaseRenewal
      ? LEASE_RENEWAL_TENANT_PHASE_COUNT - 1
      : TENANT_STEP_PHASE_COUNT - 1;

    if (tenant.currentPhaseIndex < maxPhaseIndex) {
      setTenantPhaseIndex(tenant.currentPhaseIndex + 1);
    }
  }

  function goToPreviousPhase() {
    if (tenant.currentPhaseIndex > 0) {
      setTenantPhaseIndex(tenant.currentPhaseIndex - 1);
    }
  }

  return {
    currentPhaseIndex: tenant.currentPhaseIndex,
    tenantData: tenant.tenantData,
    setTenantData,
    rentedUnits: tenant.rentedUnits,
    setRentedUnits,
    leaseRenewalAddNotes: tenant.leaseRenewalAddNotes,
    leaseRenewalNotes: tenant.leaseRenewalNotes,
    setLeaseRenewalAddNotes,
    setLeaseRenewalNotes,
    isLeaseRenewal,
    updateStatus,
    canContinue,
    isLastPhase,
    goToNextPhase,
    goToPreviousPhase,
  };
}
