"use client";

import { useState } from "react";

import {
  EMPTY_FINANCE_DATA,
  isFinanceDataComplete,
  type FinanceDataState,
  type TenantPermissionsState,
} from "@/features/create-contract/types/finance-step";

export function useCreateContractFinanceStep() {
  const [financeData, setFinanceData] =
    useState<FinanceDataState>(EMPTY_FINANCE_DATA);
  const [tenantPermissionsDialogOpen, setTenantPermissionsDialogOpen] =
    useState(false);
  const [otherConditionsDialogOpen, setOtherConditionsDialogOpen] =
    useState(false);

  const canContinue = isFinanceDataComplete(financeData);

  function saveTenantPermissions(tenantPermissions: TenantPermissionsState) {
    const hasAnyPermission = Object.values(tenantPermissions).some(Boolean);

    setFinanceData((current) => ({
      ...current,
      tenantPermissions,
      addTenantPermissions: hasAnyPermission,
    }));
  }

  function saveOtherConditions(otherConditionsText: string) {
    setFinanceData((current) => ({
      ...current,
      otherConditionsText,
      addOtherConditions: otherConditionsText.trim().length > 0,
    }));
  }

  return {
    financeData,
    setFinanceData,
    canContinue,
    tenantPermissionsDialogOpen,
    setTenantPermissionsDialogOpen,
    otherConditionsDialogOpen,
    setOtherConditionsDialogOpen,
    saveTenantPermissions,
    saveOtherConditions,
  };
}
