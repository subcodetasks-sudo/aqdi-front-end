"use client";

import { isTenantDataComplete } from "@/features/create-contract/types/tenant-step";
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

/** Tenant data → unit choice (same or edit) */
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
  const setLeaseRenewalUnitMode = useCreateContractDraftStore(
    (state) => state.setLeaseRenewalUnitMode,
  );

  const skipOwnerState = {
    selectedDeedType,
    instrumentType: contractStep1Data?.instrument_type,
  };
  const isLeaseRenewal = isLeaseRenewalContract(skipOwnerState);

  const phaseCount = isLeaseRenewal
    ? LEASE_RENEWAL_TENANT_PHASE_COUNT
    : TENANT_STEP_PHASE_COUNT;

  const currentPhaseIndex = Math.min(
    tenant.currentPhaseIndex,
    phaseCount - 1,
  );
  const isLastPhase = currentPhaseIndex === phaseCount - 1;
  const leaseRenewalUnitMode = tenant.leaseRenewalUnitMode ?? "same";

  const canContinue = isLeaseRenewal
    ? currentPhaseIndex === 0
      ? isTenantDataComplete(tenant.tenantData)
      : leaseRenewalUnitMode === "same" ||
        areRentedUnitsComplete(tenant.rentedUnits)
    : currentPhaseIndex === 0
      ? isTenantDataComplete(tenant.tenantData)
      : areRentedUnitsComplete(tenant.rentedUnits);

  function updateStatus(status: TenantStatusOption | "") {
    setTenantData(updateContractTenantStatus(tenant.tenantData, status));
  }

  function goToNextPhase() {
    const maxPhaseIndex = phaseCount - 1;

    if (currentPhaseIndex < maxPhaseIndex) {
      setTenantPhaseIndex(currentPhaseIndex + 1);
    }
  }

  function goToPreviousPhase() {
    if (currentPhaseIndex > 0) {
      setTenantPhaseIndex(currentPhaseIndex - 1);
    }
  }

  return {
    currentPhaseIndex,
    phaseCount,
    tenantData: tenant.tenantData,
    setTenantData,
    rentedUnits: tenant.rentedUnits,
    setRentedUnits,
    leaseRenewalUnitMode,
    setLeaseRenewalUnitMode,
    isLeaseRenewal,
    updateStatus,
    canContinue,
    isLastPhase,
    goToNextPhase,
    goToPreviousPhase,
  };
}
