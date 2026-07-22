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

function toContractTypeId(
  contractType: PropertyUnitCardData["contractType"],
): ContractTypeId {
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
    selectedUnits: PropertyUnitCardData[],
    property: PropertyWithUnitsApiData,
  ) {
    if (selectedUnits.length < 1) {
      toast.error(t("selectAtLeastOneUnit"));
      return;
    }

    const unitIds = selectedUnits.map((unit) => unit.unitId);
    const apiUnits = property.units.filter((item) => unitIds.includes(item.id));

    if (apiUnits.length !== selectedUnits.length) {
      toast.error(t("startContractError"));
      return;
    }

    const contractType = selectedUnits[0].contractType;

    setIsStarting(true);

    try {
      const result = await startContract({
        contract_type: contractType,
        is_real: true,
        real_id: selectedUnits[0].propertyId,
        unit_ids: unitIds,
        instrument_type: property.instrument_type ?? undefined,
      });

      if (!result.ok) {
        toast.error(result.error || t("startContractError"));
        return;
      }

      const resolvedUnitIds =
        result.unitIds.length > 0 ? result.unitIds : unitIds;

      startExistingPropertyContractFlow({
        session: {
          contractId: result.contractId,
          uuid: result.uuid,
          contractType,
          isReal: true,
          realId: selectedUnits[0].propertyId,
          realUnitsId: result.realUnitsId ?? resolvedUnitIds[0],
          unitIds: resolvedUnitIds,
          unitsCount: result.unitsCount || resolvedUnitIds.length,
        },
        context: {
          property,
          units: apiUnits,
        },
      });

      router.push(`/create-contract?id=${toContractTypeId(contractType)}`);
    } finally {
      setIsStarting(false);
    }
  }

  return {
    startContract: handleStartContract,
    isStarting,
  };
}
