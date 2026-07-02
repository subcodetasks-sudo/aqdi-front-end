"use server";

import type { ContractInstrumentType } from "@/features/create-contract/types/instrument-type";
import type { ContractStep1ApiData } from "@/features/create-contract/types/contract-step1-api";
import { apiFormDataRequest } from "@/lib/api/api-request";

type ContractStep1ApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: ContractStep1ApiData;
};

export type SubmitContractStep1Payload = {
  contractId: number;
  instrumentType: ContractInstrumentType;
  imageInstrument: File;
};

export async function submitContractStep1(payload: SubmitContractStep1Payload) {
  const formData = new FormData();
  formData.append("id", String(payload.contractId));
  formData.append("instrument_type", payload.instrumentType);
  formData.append("image_instrument", payload.imageInstrument);

  const response = await apiFormDataRequest<ContractStep1ApiResponse>(
    "/contract/step1",
    formData,
  );

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Failed to submit deed data",
    };
  }

  return {
    ok: true as const,
    data: response.data.data,
    message: response.data.message,
  };
}
