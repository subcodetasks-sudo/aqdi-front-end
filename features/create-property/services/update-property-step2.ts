"use server";

import { apiFormDataRequest } from "@/lib/api/api-request";
import type { SubmitPropertyStep2Payload } from "@/features/create-property/services/submit-property-step2";
import { appendPropertyStep2Fields } from "@/features/create-property/utils/build-property-step2-form-data";

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

export async function updatePropertyStep2(payload: SubmitPropertyStep2Payload) {
  const formData = new FormData();

  appendPropertyStep2Fields(formData, payload);

  const response = await apiFormDataRequest<PropertyStep2ApiResponse>(
    "/realstate/update/step2",
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
