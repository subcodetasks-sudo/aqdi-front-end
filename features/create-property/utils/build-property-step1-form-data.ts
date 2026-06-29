import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import type { PropertyNationalAddressMethodId } from "@/features/create-property/types/national-address";

export type PropertyStep1FormPayload = {
  propertyId?: number;
  instrumentType: PropertyDeedTypeId;
  imageInstrument?: File;
  addressMethod: PropertyNationalAddressMethodId;
  imageAddress?: File;
  addressUrl?: string;
  latitude: number;
  longitude: number;
};

export function appendPropertyStep1Fields(
  formData: FormData,
  payload: PropertyStep1FormPayload,
) {
  if (payload.propertyId) {
    formData.append("id", String(payload.propertyId));
  }

  formData.append("instrument_type", payload.instrumentType);

  if (payload.imageInstrument) {
    formData.append("image_instrument", payload.imageInstrument);
  }

  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));

  if (payload.addressMethod === "photo" && payload.imageAddress) {
    formData.append("image_address", payload.imageAddress);
  }

  if (payload.addressMethod === "link" && payload.addressUrl) {
    formData.append("address_url", payload.addressUrl);
  }
}
