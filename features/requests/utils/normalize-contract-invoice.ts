import type {
  ContractInvoice,
  ContractInvoiceItem,
  InvoiceStatus,
} from "@/features/requests/types/contract-invoice";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNullableString(value: unknown) {
  const valueAsString = asString(value);
  return valueAsString || null;
}

function asNullableNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return null;
}

function normalizeItems(raw: unknown): ContractInvoiceItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((item, index) => {
    const row = (item && typeof item === "object" ? item : {}) as Record<
      string,
      unknown
    >;

    return {
      index:
        typeof row.index === "number" || typeof row.index === "string"
          ? row.index
          : index + 1,
      description: asString(row.description) || asString(row.name) || "—",
      amount_label:
        asString(row.amount_label) ||
        asString(row.amount) ||
        asString(row.price_label) ||
        "—",
    };
  });
}

export function normalizeContractInvoice(
  raw: Record<string, unknown>,
  fallbackContractId: number,
): ContractInvoice {
  const contractId =
    asNullableNumber(raw.contract_id) ??
    asNullableNumber(raw.order_number) ??
    asNullableNumber(raw.id) ??
    fallbackContractId;

  const status = (asNullableString(raw.status) as InvoiceStatus | null) ?? null;
  const isPaid =
    raw.is_paid === true ||
    raw.is_paid === 1 ||
    status === "paid";
  const isRefunded =
    raw.is_refunded === true ||
    raw.is_refunded === 1 ||
    status === "refunded" ||
    status === "returned";

  return {
    contractId,
    platform_name: asString(raw.platform_name),
    platform_subtitle: asString(raw.platform_subtitle),
    title: asString(raw.title),
    invoice_number: asString(raw.invoice_number),
    datetime_label: asString(raw.datetime_label),
    reference_number: asNullableString(raw.reference_number),
    customer_name: asNullableString(raw.customer_name),
    order_number: asString(raw.order_number) || String(contractId),
    contract_type_label: asString(raw.contract_type_label),
    items: normalizeItems(raw.items),
    total_due_label: asString(raw.total_due_label),
    total_amount_label: asString(raw.total_amount_label),
    status,
    status_label: asString(raw.status_label),
    status_color: asNullableString(raw.status_color),
    print_label: asString(raw.print_label),
    is_paid: isPaid,
    is_refunded: isRefunded,
    total_amount: asNullableNumber(raw.total_amount),
  };
}
