"use server";

import type {
  PaymentContentApiResponse,
  PaymentContentItem,
  PaymentContentType,
} from "@/features/payment/types/payment-content";
import { apiRequest } from "@/lib/api/api-request";

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asPaymentContentItem(
  value: unknown,
  type: PaymentContentType,
): PaymentContentItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const item = value as Partial<PaymentContentItem>;
  if (item.type !== type || typeof item.id !== "number") {
    return null;
  }

  return {
    id: item.id,
    type,
    message: asNullableString(item.message),
    button_text: asNullableString(item.button_text),
    button_link: asNullableString(item.button_link),
    button_text_2: asNullableString(item.button_text_2),
    button_link_2: asNullableString(item.button_link_2),
  };
}

export async function getPaymentContent(
  type: PaymentContentType,
): Promise<PaymentContentItem | null> {
  const response = await apiRequest<PaymentContentApiResponse>(
    `/payment-messages?type=${type}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success) {
    return null;
  }

  return asPaymentContentItem(response.data.data, type);
}
