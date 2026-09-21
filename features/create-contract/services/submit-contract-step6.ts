"use server";

import type { ContractStep6ApiData } from "@/features/create-contract/types/contract-step6-api";
import type { ContractFinancialData } from "@/features/create-contract/types/contract-financial";
import {
  buildContractStep6Body,
  type ContractStep6Payload,
} from "@/features/create-contract/utils/build-contract-step6-payload";
import { parseContractFinancialData } from "@/features/create-contract/utils/parse-contract-financial";
import { apiRequest } from "@/lib/api/api-request";

type ContractStep6ApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: ContractStep6ApiData;
};

export type SubmitContractStep6Result =
  | {
      ok: true;
      data: ContractStep6ApiData;
      financial: ContractFinancialData | null;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function submitContractStep6(
  payload: ContractStep6Payload,
): Promise<SubmitContractStep6Result> {
  const response = await apiRequest<ContractStep6ApiResponse>("/contract/step6", {
    method: "POST",
    body: JSON.stringify(buildContractStep6Body(payload)),
    cache: "no-store",
  });

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false,
      error:
        response.error ||
        response.data?.message ||
        "Failed to submit finance data",
    };
  }

  const data = response.data.data;
  const financial = parseContractFinancialData(data);

  return {
    ok: true,
    data,
    financial,
    message: response.data.message,
  };
}
