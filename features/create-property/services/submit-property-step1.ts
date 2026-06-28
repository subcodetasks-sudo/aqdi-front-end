"use server";

import { apiFormDataRequest } from "@/lib/api/api-request";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import type { PropertyNationalAddressMethodId } from "@/features/create-property/types/national-address";

export type SubmitPropertyStep1Payload = {
  contractType: PropertyContractType;
  instrumentType: PropertyDeedTypeId;
  imageInstrument: File;
  addressMethod: PropertyNationalAddressMethodId;
  imageAddress?: File;
  addressUrl?: string;
  latitude: number;
  longitude: number;
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

export async function submitPropertyStep1(payload: SubmitPropertyStep1Payload) {
  const formData = new FormData();
  formData.append("contract_type", payload.contractType);
  formData.append("instrument_type", payload.instrumentType);
  formData.append("image_instrument", payload.imageInstrument);
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));

  if (payload.addressMethod === "photo" && payload.imageAddress) {
    formData.append("image_address", payload.imageAddress);
  }

  if (payload.addressMethod === "link" && payload.addressUrl) {
    formData.append("address_url", payload.addressUrl);
  }

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
