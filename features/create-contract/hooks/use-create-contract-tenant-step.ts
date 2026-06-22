"use client";

import { useState } from "react";

import {
  EMPTY_RENTED_UNIT_DATA,
  isRentedUnitDataComplete,
  TENANT_STEP_PHASE_COUNT,
  type RentedUnitDataState,
} from "@/features/create-contract/types/rented-unit-step";
import {
  EMPTY_INDIVIDUAL_TENANT_DATA,
  EMPTY_ORGANIZATION_TENANT_DATA,
  EMPTY_TENANT_DATA,
  isOrganizationTenantStatus,
  isTenantDataComplete,
  type TenantDataState,
  type TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";

export function useCreateContractTenantStep() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [tenantData, setTenantData] =
    useState<TenantDataState>(EMPTY_TENANT_DATA);
  const [rentedUnitData, setRentedUnitData] =
    useState<RentedUnitDataState>(EMPTY_RENTED_UNIT_DATA);
  const [saveLaterOpen, setSaveLaterOpen] = useState(false);

  const isLastPhase = currentPhaseIndex === TENANT_STEP_PHASE_COUNT - 1;

  const canContinue =
    currentPhaseIndex === 0
      ? isTenantDataComplete(tenantData)
      : isRentedUnitDataComplete(rentedUnitData);

  function updateStatus(status: TenantStatusOption | "") {
    setTenantData({
      status,
      individual:
        status === "individual"
          ? tenantData.individual
          : EMPTY_INDIVIDUAL_TENANT_DATA,
      organization: isOrganizationTenantStatus(status)
        ? tenantData.organization
        : EMPTY_ORGANIZATION_TENANT_DATA,
    });
  }

  function goToNextPhase() {
    if (currentPhaseIndex < TENANT_STEP_PHASE_COUNT - 1) {
      setCurrentPhaseIndex((phase) => phase + 1);
    }
  }

  function goToPreviousPhase() {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex((phase) => phase - 1);
    }
  }

  function openSaveLaterDialog() {
    setSaveLaterOpen(true);
  }

  return {
    currentPhaseIndex,
    tenantData,
    setTenantData,
    rentedUnitData,
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
