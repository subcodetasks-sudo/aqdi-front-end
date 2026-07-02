"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { startContract } from "@/features/create-contract/services/start-contract";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";
import type { PropertyWithUnitsApiData } from "@/features/property-units/types/property-units-api";

function toContractTypeId(contractType: PropertyUnitCardData["contractType"]): ContractTypeId {
  return contractType === "commercial" ? "commercial" : "residential";
}

export function useStartContractFromUnit() {
  const router = useRouter();
  const t = useTranslations("propertyUnits.card");
  const startExistingPropertyContractFlow = useCreateContractDraftStore(
    (state) => state.startExistingPropertyContractFlow,
  );
  const [isStarting, setIsStarting] = useState(false);

  async function handleStartContract(
    unit: PropertyUnitCardData,
    property: PropertyWithUnitsApiData,
  ) {
    const apiUnit = property.units.find((item) => item.id === unit.unitId);

    if (!apiUnit) {
      toast.error(t("startContractError"));
      return;
    }

    setIsStarting(true);

    try {
      const result = await startContract({
        contract_type: unit.contractType,
        is_real: true,
        real_id: String(unit.propertyId),
        real_units_id: String(unit.unitId),
      });

      if (!result.ok) {
        toast.error(result.error || t("startContractError"));
        return;
      }

      startExistingPropertyContractFlow({
        session: {
          contractId: result.contractId,
          uuid: result.uuid,
          contractType: unit.contractType,
          isReal: true,
          realId: unit.propertyId,
          realUnitsId: unit.unitId,
        },
        context: {
          property,
          unit: apiUnit,
        },
      });

      router.push(`/create-contract?id=${toContractTypeId(unit.contractType)}`);
    } finally {
      setIsStarting(false);
    }
  }

  return {
    startContract: handleStartContract,
    isStarting,
  };
}
