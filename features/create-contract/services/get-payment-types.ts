"use server";

import type { PaymentTypesApiResponse } from "@/features/create-contract/types/payment-type";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import { apiRequest } from "@/lib/api/api-request";

export async function getPaymentTypes(contractType: PropertyContractType) {
  const response = await apiRequest<PaymentTypesApiResponse>(
    `/payments-types?contract_type=${contractType}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    throw new Error(
      response.error ||
        response.data?.message ||
        "Failed to fetch payment types",
    );
  }

  return response.data.data;
}
