export function parsePaymentStatusAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function resolvePaidAmountFromStatusPayload(data: {
  paid_amount?: unknown;
  cart_amount?: unknown;
  amount?: unknown;
  payment?: unknown;
}): number | null {
  const paymentAmount =
    data.payment && typeof data.payment === "object" && "amount" in data.payment
      ? data.payment.amount
      : null;

  return (
    parsePaymentStatusAmount(data.paid_amount) ??
    parsePaymentStatusAmount(paymentAmount) ??
    parsePaymentStatusAmount(data.cart_amount) ??
    parsePaymentStatusAmount(data.amount)
  );
}
