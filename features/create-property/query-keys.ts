import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export const propertyLookupKeys = {
  all: ["property-lookups"] as const,
  types: (contractType: PropertyContractType) =>
    [...propertyLookupKeys.all, "types", contractType] as const,
  usages: (contractType: PropertyContractType) =>
    [...propertyLookupKeys.all, "usages", contractType] as const,
};
