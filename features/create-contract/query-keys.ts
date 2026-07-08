import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export const contractLocationKeys = {
  all: ["contract-location"] as const,
  regions: () => [...contractLocationKeys.all, "regions"] as const,
  cities: (regionId: number) =>
    [...contractLocationKeys.all, "cities", regionId] as const,
  contractPeriods: (contractType: PropertyContractType) =>
    [...contractLocationKeys.all, "contract-periods", contractType] as const,
};

export const contractPaperworkKeys = {
  all: ["contract-paperwork"] as const,
  list: (contractType: PropertyContractType) =>
    [...contractPaperworkKeys.all, contractType] as const,
};

export const contractServicesPricingKeys = {
  all: ["contract-services-pricing"] as const,
  list: (contractType: PropertyContractType) =>
    [...contractServicesPricingKeys.all, contractType] as const,
};

export const contractFinancialKeys = {
  all: ["contract-financial"] as const,
  detail: (contractId: number) =>
    [...contractFinancialKeys.all, contractId] as const,
};
