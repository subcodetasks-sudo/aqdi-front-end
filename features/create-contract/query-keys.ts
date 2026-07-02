import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export const contractLocationKeys = {
  all: ["contract-location"] as const,
  regions: () => [...contractLocationKeys.all, "regions"] as const,
  cities: (regionId: number) =>
    [...contractLocationKeys.all, "cities", regionId] as const,
  contractPeriods: (contractType: PropertyContractType) =>
    [...contractLocationKeys.all, "contract-periods", contractType] as const,
};
