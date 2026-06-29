"use server";

import { apiFormDataRequest } from "@/lib/api/api-request";
import type { SubmitPropertyStep1Payload } from "@/features/create-property/services/submit-property-step1";
import { appendPropertyStep1Fields } from "@/features/create-property/utils/build-property-step1-form-data";

export type UpdatePropertyStep1Payload = SubmitPropertyStep1Payload & {
  propertyId: number;
  imageInstrument?: File;
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

  appendPropertyStep1Fields(formData, {
    propertyId: payload.propertyId,
    instrumentType: payload.instrumentType,
    imageInstrument: payload.imageInstrument,
    addressMethod: payload.addressMethod,
    imageAddress: payload.imageAddress,
    addressUrl: payload.addressUrl,
    latitude: payload.latitude,
    longitude: payload.longitude,
  });

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
