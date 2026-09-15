"use server";

import type {
  ContractDocFeeApiResponse,
  ContractDocFeePreview,
} from "@/features/create-contract/types/contract-doc-fee";
import { resolveContractDocFeePreview } from "@/features/create-contract/types/contract-doc-fee";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { apiRequest } from "@/lib/api/api-request";

export type PreviewContractDocFeeInput = {
  contractId?: number | null;
  contractType?: PropertyContractType;
  durationYears: number;
  durationMonths: number;
};

export async function previewContractDocFee(
  input: PreviewContractDocFeeInput,
): Promise<ContractDocFeePreview> {
  const body: Record<string, string | number> = {
    duration_years: input.durationYears,
    duration_months: input.durationMonths,
  };

  if (input.contractId) {
    body.id = input.contractId;
  } else if (input.contractType) {
    body.contract_type = input.contractType;
  }

  const response = await apiRequest<ContractDocFeeApiResponse>(
    "/contract/doc-fee",
    {
      method: "POST",
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success || !response.data.data) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to preview contract documentation fee",
    );
  }

  return resolveContractDocFeePreview(response.data.data);
}
