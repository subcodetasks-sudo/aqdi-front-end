"use server";

import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type {
  ServicePricingItem,
  ServicesPricingApiResponse,
} from "@/features/create-contract/types/services-pricing";
import { apiRequest } from "@/lib/api/api-request";

export async function getServicesPricing(
  contractType: PropertyContractType,
): Promise<ServicePricingItem[]> {
  const response = await apiRequest<ServicesPricingApiResponse>(
    `/services-pricing?contract_type=${contractType}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch services pricing",
    );
  }

  return response.data.data;
}
