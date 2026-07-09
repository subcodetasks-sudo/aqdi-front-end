"use server";

import type {
  ContractPaymentStatusApiResponse,
  ContractPaymentStatusData,
} from "@/features/create-contract/types/contract-payment";
import { apiRequest } from "@/lib/api/api-request";

export type ContractPaymentStatusSource = "contract" | "admin";

function mapPaymentStatus(
  data: NonNullable<ContractPaymentStatusApiResponse["data"]>,
): ContractPaymentStatusData {
  return {
    result: data.result,
    contractUuid: data.contract_uuid,
    contractId: data.contract_id,
    isCompleted: data.is_completed,
    employeePaidRecord: data.employee_paid_record,
    payment: data.payment,
  };
}

async function getContractPaymentStatus(
  contractUuid: string,
  status: "success" | "error",
  source: ContractPaymentStatusSource = "contract",
): Promise<
  | { ok: true; data: ContractPaymentStatusData; message: string }
  | { ok: false; error: string }
> {
  const endpoint =
    source === "admin"
      ? `/api/admin/payment-gateway/status/${status}/${contractUuid}`
      : `/status/${status}/${contractUuid}`;

  const response = await apiRequest<ContractPaymentStatusApiResponse>(
    endpoint,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false,
      error:
        response.error ||
        response.data?.message ||
        "Failed to load payment status",
    };
  }

  return {
    ok: true,
    message: response.data.message,
    data: mapPaymentStatus(response.data.data),
  };
}

export async function getContractPaymentSuccessStatus(
  contractUuid: string,
  source: ContractPaymentStatusSource = "contract",
) {
  return getContractPaymentStatus(contractUuid, "success", source);
}

export async function getContractPaymentErrorStatus(
  contractUuid: string,
  source: ContractPaymentStatusSource = "contract",
) {
  return getContractPaymentStatus(contractUuid, "error", source);
}
