"use server";

import { apiRequest } from "@/lib/api/api-request";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type {
  PropertyLookupApiResponse,
  PropertyLookupOption,
} from "@/features/create-property/types/property-lookup";

export async function getRealEstateUsages(
  contractType: PropertyContractType,
): Promise<PropertyLookupOption[]> {
  const response = await apiRequest<PropertyLookupApiResponse>(
    `/real-estat-usage?contract_type=${contractType}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch property usages",
    );
  }

  return response.data.data;
}
