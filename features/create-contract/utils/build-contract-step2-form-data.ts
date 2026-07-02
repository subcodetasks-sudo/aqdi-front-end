import type { NationalAddressMethodId } from "@/features/create-contract/types/national-address";

export type SubmitContractStep2Payload = {
  contractId: number;
  addressMethod: NationalAddressMethodId;
  latitude: number;
  longitude: number;
  imageAddress?: File;
  addressUrl?: string;
};

export function appendContractStep2Fields(
  formData: FormData,
  payload: SubmitContractStep2Payload,
) {
  formData.append("id", String(payload.contractId));
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));
  formData.append("lat", String(payload.latitude));
  formData.append("lng", String(payload.longitude));

  if (payload.addressMethod === "photo" && payload.imageAddress) {
    formData.append("image_address", payload.imageAddress);
  }

  if (payload.addressMethod === "link" && payload.addressUrl) {
    formData.append("address_url", payload.addressUrl);
  }
}
