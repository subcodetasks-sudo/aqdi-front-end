"use server";

import { apiFormDataRequest } from "@/lib/api/api-request";
import type {
  PropertyAgentDataState,
  PropertyHasAgentOption,
  PropertyOwnerDataState,
} from "@/features/create-property/types/owner-step";
import { appendPropertyStep2Fields } from "@/features/create-property/utils/build-property-step2-form-data";

export type SubmitPropertyStep2Payload = {
  propertyId: number;
  propertyName: string;
  ownerData: PropertyOwnerDataState;
  agentData: PropertyAgentDataState;
};

type PropertyStep2ApiData = {
  id: number;
  step: number;
};

type PropertyStep2ApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: PropertyStep2ApiData;
};

export async function submitPropertyStep2(payload: SubmitPropertyStep2Payload) {
  const formData = new FormData();

  appendPropertyStep2Fields(formData, payload);

  const response = await apiFormDataRequest<PropertyStep2ApiResponse>(
    "/realstate/step2",
    formData,
  );

  if (!response.ok || !response.data?.success) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  return {
    ok: true as const,
    propertyId: response.data.data?.id ?? payload.propertyId,
    message: response.data.message,
  };
}
