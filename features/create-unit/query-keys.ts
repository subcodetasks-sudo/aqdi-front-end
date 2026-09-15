import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export const unitKeys = {
  all: ["units"] as const,
  types: (contractType: PropertyContractType) =>
    [...unitKeys.all, "types", contractType] as const,
  usage: (contractType: PropertyContractType) =>
    [...unitKeys.all, "usage", contractType] as const,
};
