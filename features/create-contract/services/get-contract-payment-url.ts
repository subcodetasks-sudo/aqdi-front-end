"use server";

import type {
  ContractPaymentApiResponse,
  ContractPaymentData,
} from "@/features/create-contract/types/contract-payment";
import { apiRequest } from "@/lib/api/api-request";

function resolvePaymentUrl(data: ContractPaymentApiResponse | null) {
  if (!data) {
    return null;
  }

  return (
    data.payment_url ??
    data.Payment_url ??
    data.data?.payment_url ??
    data.data?.Payment_url ??
    null
  );
}

function resolvePaymentSuccessUrl(data: ContractPaymentApiResponse | null) {
  if (!data) {
    return null;
  }

  return data.payment_success_url ?? data.data?.payment_success_url ?? null;
}

function resolvePaymentErrorUrl(data: ContractPaymentApiResponse | null) {
  if (!data) {
    return null;
  }

  return data.payment_error_url ?? data.data?.payment_error_url ?? null;
}

export async function getContractPaymentUrl(contractUuid: string): Promise<
  | { ok: true; data: ContractPaymentData }
  | { ok: false; error: string }
> {
  const response = await apiRequest<ContractPaymentApiResponse>(
    `/payment/${contractUuid}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const payload = response.data;
  const paymentUrl = resolvePaymentUrl(payload);

  if (!response.ok || !paymentUrl) {
    return {
      ok: false,
      error:
        response.error ||
        payload?.message ||
        "Failed to initiate contract payment",
    };
  }

  return {
    ok: true,
    data: {
      paymentUrl,
      paymentSuccessUrl: resolvePaymentSuccessUrl(payload),
      paymentErrorUrl: resolvePaymentErrorUrl(payload),
      invoiceId: payload?.invoice_id ?? payload?.data?.invoice_id ?? null,
      contractUuid: payload?.contract_uuid ?? payload?.data?.contract_uuid ?? contractUuid,
      cartAmount: payload?.cart_amount ?? payload?.data?.cart_amount ?? null,
    },
  };
}
