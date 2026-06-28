import type { PropertyTypeId } from "@/features/properties/types/property-type";

export type PropertyContractType = "housing" | "commercial";

export function toPropertyContractType(
  propertyType: PropertyTypeId,
): PropertyContractType {
  return propertyType === "commercial" ? "commercial" : "housing";
}
