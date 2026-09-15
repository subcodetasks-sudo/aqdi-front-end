"use server";

import type {
  ContractEmployeePaidRecord,
  ContractPaymentGatewayRecord,
  ContractPaymentStatusApiResponse,
  ContractPaymentStatusData,
} from "@/features/create-contract/types/contract-payment";
import { resolvePaidAmountFromStatusPayload } from "@/features/payment/utils/parse-payment-status-amount";
import { apiRequest } from "@/lib/api/api-request";

export type ContractPaymentStatusSource = "contract" | "admin";

function asPaymentRecord(value: unknown): ContractPaymentGatewayRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const status =
    "status" in value && typeof value.status === "string" ? value.status : null;
  const amount =
    "amount" in value &&
    (typeof value.amount === "string" || typeof value.amount === "number")
      ? value.amount
      : null;

  return { status, amount };
}

function asEmployeePaidRecord(value: unknown): ContractEmployeePaidRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const isPaid =
    "is_paid" in value &&
    (typeof value.is_paid === "boolean" || typeof value.is_paid === "number")
      ? value.is_paid
      : null;

  return { is_paid: isPaid };
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function mapPaymentStatus(
  data: NonNullable<ContractPaymentStatusApiResponse["data"]>,
): ContractPaymentStatusData {
  return {
    result: data.result,
    resolvedResult: data.resolved_result ?? null,
    contractUuid: data.contract_uuid,
    contractId: data.contract_id,
    contractType: asNullableString(data.contract_type),
    contractTypeTrans: asNullableString(data.contract_type_trans),
    paidAmount: resolvePaidAmountFromStatusPayload(data),
    isCompleted: data.is_completed,
    paymentConfirmed: data.payment_confirmed ?? null,
    employeePaidRecord: asEmployeePaidRecord(data.employee_paid_record),
    payment: asPaymentRecord(data.payment),
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
