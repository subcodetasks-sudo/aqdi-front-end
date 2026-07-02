import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export type ContractTypeId = "residential" | "commercial";

export function toPropertyContractType(
  contractType: ContractTypeId,
): PropertyContractType {
  return contractType === "commercial" ? "commercial" : "housing";
}
