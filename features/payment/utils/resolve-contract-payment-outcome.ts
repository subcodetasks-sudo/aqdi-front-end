import type { ContractPaymentStatusData } from "@/features/create-contract/types/contract-payment";

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function hasSuccessfulPayment(status: ContractPaymentStatusData | null) {
  if (!status) {
    return false;
  }

  if (status.result === "success") {
    return true;
  }

  if (status.isCompleted) {
    return true;
  }

  if (
    isObjectLike(status.payment) &&
    typeof status.payment.status === "string"
  ) {
    const paymentStatus = status.payment.status.toLowerCase();
    if (paymentStatus === "success" || paymentStatus === "paid") {
      return true;
    }
  }

  if (
    isObjectLike(status.employeePaidRecord) &&
    (status.employeePaidRecord.is_paid === true ||
      status.employeePaidRecord.is_paid === 1)
  ) {
    return true;
  }

  return false;
}
