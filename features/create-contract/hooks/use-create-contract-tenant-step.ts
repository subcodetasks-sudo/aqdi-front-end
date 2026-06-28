"use client";

import { useState } from "react";

import {
  isRentedUnitDataComplete,
  TENANT_STEP_PHASE_COUNT,
} from "@/features/create-contract/types/rented-unit-step";
import { isTenantDataComplete } from "@/features/create-contract/types/tenant-step";
import {
  updateContractTenantStatus,
  useCreateContractDraftStore,
} from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { TenantStatusOption } from "@/features/create-contract/types/tenant-step";

export function useCreateContractTenantStep() {
  const tenant = useCreateContractDraftStore((state) => state.tenant);
  const setTenantPhaseIndex = useCreateContractDraftStore(
    (state) => state.setTenantPhaseIndex,
  );
  const setTenantData = useCreateContractDraftStore((state) => state.setTenantData);
  const setRentedUnitData = useCreateContractDraftStore(
    (state) => state.setRentedUnitData,
  );
  const [saveLaterOpen, setSaveLaterOpen] = useState(false);

  const isLastPhase = tenant.currentPhaseIndex === TENANT_STEP_PHASE_COUNT - 1;

  const canContinue =
    tenant.currentPhaseIndex === 0
      ? isTenantDataComplete(tenant.tenantData)
      : isRentedUnitDataComplete(tenant.rentedUnitData);

  function updateStatus(status: TenantStatusOption | "") {
    setTenantData(updateContractTenantStatus(tenant.tenantData, status));
  }

  function goToNextPhase() {
    if (tenant.currentPhaseIndex < TENANT_STEP_PHASE_COUNT - 1) {
      setTenantPhaseIndex(tenant.currentPhaseIndex + 1);
    }
  }

  function goToPreviousPhase() {
    if (tenant.currentPhaseIndex > 0) {
      setTenantPhaseIndex(tenant.currentPhaseIndex - 1);
    }
  }

  function openSaveLaterDialog() {
    setSaveLaterOpen(true);
  }

  return {
    currentPhaseIndex: tenant.currentPhaseIndex,
    tenantData: tenant.tenantData,
    setTenantData,
    rentedUnitData: tenant.rentedUnitData,
    setRentedUnitData,
    updateStatus,
    canContinue,
    isLastPhase,
    saveLaterOpen,
    setSaveLaterOpen,
    openSaveLaterDialog,
    goToNextPhase,
    goToPreviousPhase,
  };
}
