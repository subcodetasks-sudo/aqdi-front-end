import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { parsePropertyType } from "@/features/properties/types/property-type";

export function parseUnitContractType(
  contractType: string | undefined,
  propertyType: string | undefined,
): PropertyContractType {
  if (contractType === "commercial" || contractType === "housing") {
    return contractType;
  }

  return parsePropertyType(propertyType) === "commercial"
    ? "commercial"
    : "housing";
}

export function parseUnitPropertyId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function parseUnitId(value: string | undefined): number | null {
  return parseUnitPropertyId(value);
}
