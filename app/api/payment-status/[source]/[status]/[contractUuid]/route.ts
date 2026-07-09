import { NextResponse } from "next/server";

import {
  getContractPaymentErrorStatus,
  getContractPaymentSuccessStatus,
  type ContractPaymentStatusSource,
} from "@/features/create-contract/services/get-contract-payment-status";
import { hasSuccessfulPayment } from "@/features/payment/utils/resolve-contract-payment-outcome";

type RouteContext = {
  params: Promise<{
    source: string;
    status: string;
    contractUuid: string;
  }>;
};

function normalizeSource(source: string): ContractPaymentStatusSource {
  return source === "admin" ? "admin" : "contract";
}

function normalizeStatus(status: string): "success" | "error" {
  return status === "error" ? "error" : "success";
}

export async function GET(_request: Request, context: RouteContext) {
  const { source, status, contractUuid } = await context.params;
  const normalizedSource = normalizeSource(source);
  const normalizedStatus = normalizeStatus(status);

  const result =
    normalizedStatus === "success"
      ? await getContractPaymentSuccessStatus(contractUuid, normalizedSource)
      : await getContractPaymentErrorStatus(contractUuid, normalizedSource);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: result.message,
    data: result.data,
    confirmedSuccess: hasSuccessfulPayment(result.data),
  });
}
