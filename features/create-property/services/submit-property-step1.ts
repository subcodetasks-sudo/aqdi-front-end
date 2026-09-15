"use server";

import { apiFormDataRequest } from "@/lib/api/api-request";
import { appendPropertyStep1Fields } from "@/features/create-property/utils/build-property-step1-form-data";
import type { PropertyStep1FormPayload } from "@/features/create-property/utils/build-property-step1-form-data";

export type SubmitPropertyStep1Payload = Omit<PropertyStep1FormPayload, "propertyId">;

type PropertyStep1ApiData = {
  id: number;
  step: number;
};

type PropertyStep1ApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: PropertyStep1ApiData;
};

export async function submitPropertyStep1(payload: SubmitPropertyStep1Payload) {
  const formData = new FormData();

  appendPropertyStep1Fields(formData, payload);

  const response = await apiFormDataRequest<PropertyStep1ApiResponse>(
    "/realstate/step1",
    formData,
  );

  if (!response.ok || !response.data?.success || !response.data.data?.id) {
    return {
      ok: false as const,
      error: response.error || response.data?.message || "Something went wrong",
    };
  }

  return {
    ok: true as const,
    propertyId: response.data.data.id,
    message: response.data.message,
  };
}
