import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { PropertyUnitApiItem } from "@/features/property-units/types/property-units-api";

type ResolveCreateUnitContractTypeInput = {
  contractType: PropertyContractType;
  unitId: number | null;
  unit: PropertyUnitApiItem | null;
};

export function resolveCreateUnitContractType({
  contractType,
  unitId,
  unit,
}: ResolveCreateUnitContractTypeInput) {
  if (!unitId || !unit) {
    return {
      contractType,
      contractTypeLocked: false,
    };
  }

  const lockedContractType =
    unit.contract_type === "housing" || unit.contract_type === "commercial"
      ? unit.contract_type
      : contractType;

  return {
    contractType: lockedContractType,
    contractTypeLocked: true,
  };
}
