"use server";

import { apiFormDataRequest } from "@/lib/api/api-request";
import type { PropertyStep1FormPayload } from "@/features/create-property/utils/build-property-step1-form-data";
import { appendPropertyStep1Fields } from "@/features/create-property/utils/build-property-step1-form-data";

export type UpdatePropertyStep1Payload = PropertyStep1FormPayload & {
  propertyId: number;
};

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

export async function updatePropertyStep1(payload: UpdatePropertyStep1Payload) {
  const formData = new FormData();

  appendPropertyStep1Fields(formData, payload);

  const response = await apiFormDataRequest<PropertyStep1ApiResponse>(
    "/realstate/update/step1",
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
