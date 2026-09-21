import type {
  ContractFinancialData,
  ContractFinancialLine,
} from "@/features/create-contract/types/contract-financial";

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseFinancialLine(raw: unknown): ContractFinancialLine | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const key = typeof record.key === "string" ? record.key.trim() : "";
  const label = typeof record.label === "string" ? record.label.trim() : "";
  const amount = toFiniteNumber(record.amount);

  if (!key || !label || amount === null || amount <= 0) {
    return null;
  }

  const percent = toFiniteNumber(record.percent);

  return {
    key,
    label,
    amount,
    percent: percent !== null && percent > 0 ? percent : null,
  };
}

/**
 * Normalize API financial payloads (step6 / financial / finance-summary).
 * Prefer `details[]`; ignore services / additional_services for display.
 */
export function parseContractFinancialData(
  raw: unknown,
): ContractFinancialData | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  const totalPrice = toFiniteNumber(record.total_price);

  if (totalPrice === null) {
    return null;
  }

  const details = Array.isArray(record.details)
    ? record.details
        .map(parseFinancialLine)
        .filter((line): line is ContractFinancialLine => line !== null)
    : null;

  const coupon = toFiniteNumber(record.coupon);
  const totalAfterCoupon = toFiniteNumber(record.total_price_after_coupon);
  const subtotal = toFiniteNumber(record.subtotal);
  const taxPercent = toFiniteNumber(record.tax_percent);
  const taxAmount = toFiniteNumber(record.tax_amount);

  const priceDetails =
    record.price_details && typeof record.price_details === "object"
      ? (record.price_details as ContractFinancialData["price_details"])
      : null;

  return {
    details,
    price_details: priceDetails,
    services: Array.isArray(record.services)
      ? (record.services as ContractFinancialData["services"])
      : null,
    additional_services: Array.isArray(record.additional_services)
      ? (record.additional_services as ContractFinancialData["additional_services"])
      : null,
    services_total: toFiniteNumber(record.services_total),
    meter_fees_total: toFiniteNumber(record.meter_fees_total),
    subtotal,
    tax_percent: taxPercent,
    tax_amount: taxAmount,
    total_price: totalPrice,
    coupon: coupon !== null && coupon > 0 ? coupon : null,
    total_price_after_coupon: totalAfterCoupon,
    doc_fee: toFiniteNumber(record.doc_fee),
    doc_fee_lines: Array.isArray(record.doc_fee_lines)
      ? (record.doc_fee_lines as string[])
      : null,
    duration_preset:
      typeof record.duration_preset === "string"
        ? record.duration_preset
        : null,
  };
}

/** Render API `details` in order. Never invent fee rows from price_details/services. */
export function getContractFinancialDisplayLines(
  data: ContractFinancialData | null | undefined,
): ContractFinancialLine[] {
  if (!data || !Array.isArray(data.details)) {
    return [];
  }

  return data.details.filter(
    (line) =>
      typeof line.amount === "number" &&
      Number.isFinite(line.amount) &&
      line.amount > 0 &&
      line.label.trim() !== "",
  );
}

export function formatFinancialLineLabel(
  line: ContractFinancialLine,
  taxLabelTemplate?: string,
): string {
  if (
    line.key === "tax" &&
    typeof line.percent === "number" &&
    Number.isFinite(line.percent) &&
    line.percent > 0
  ) {
    if (taxLabelTemplate) {
      return taxLabelTemplate.replaceAll("{percent}", String(line.percent));
    }

    return `${line.label} (${line.percent}%)`;
  }

  return line.label;
}
