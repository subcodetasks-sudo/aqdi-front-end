"use server";

import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { apiRequest } from "@/lib/api/api-request";

export type StartContractPayload =
  | {
      contract_type: PropertyContractType;
      is_real: false;
    }
  | {
      contract_type: PropertyContractType;
      is_real: true;
      real_id: string;
      real_units_id: string;
    };

type StartContractApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: {
    contract_id: number;
    uuid: string;
  };
};

export async function startContract(payload: StartContractPayload) {
  const response = await apiRequest<StartContractApiResponse>("/contract/start", {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Failed to start contract",
    };
  }

  return {
    ok: true as const,
    contractId: response.data.data.contract_id,
    uuid: response.data.data.uuid,
    message: response.data.message,
  };
}
