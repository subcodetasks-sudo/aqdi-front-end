"use server";

import type {
  PaymentContentApiResponse,
  PaymentContentItem,
  PaymentContentType,
} from "@/features/payment/types/payment-content";
import { apiRequest } from "@/lib/api/api-request";

export async function getPaymentContent(
  type: PaymentContentType,
): Promise<PaymentContentItem | null> {
  const response = await apiRequest<PaymentContentApiResponse>(
    `/payment-content?type=${type}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return null;
  }

  return response.data.data[0] ?? null;
}
