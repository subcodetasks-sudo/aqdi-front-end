"use client";

import { isFinanceDataComplete } from "@/features/create-contract/types/finance-step";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import { useState } from "react";

export function useCreateContractFinanceStep() {
  const financeData = useCreateContractDraftStore((state) => state.financeData);
  const setFinanceData = useCreateContractDraftStore((state) => state.setFinanceData);
  const saveTenantPermissions = useCreateContractDraftStore(
    (state) => state.saveTenantPermissions,
  );
  const saveOtherConditions = useCreateContractDraftStore(
    (state) => state.saveOtherConditions,
  );
  const [tenantPermissionsDialogOpen, setTenantPermissionsDialogOpen] =
    useState(false);
  const [otherConditionsDialogOpen, setOtherConditionsDialogOpen] =
    useState(false);

  const canContinue = isFinanceDataComplete(financeData);

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
