export type ContractFinancialLineKey =
  | "contract_period_price"
  | "application_fees"
  | "electricity_meter_fee"
  | "water_meter_fee"
  | "paper_deed_fee"
  | "tax"
  | (string & {});

export type ContractFinancialLine = {
  key: ContractFinancialLineKey;
  label: string;
  amount: number;
  percent?: number | null;
};

/** @deprecated Prefer `details[]`. Kept for older API payloads. */
export type ContractFinancialPriceDetails = {
  contract_period_price?: number | null;
  application_fees?: number | null;
  tax?: number | null;
  electricity_meter_fee?: number | null;
  water_meter_fee?: number | null;
  paper_deed_fee?: number | null;
};

/** @deprecated Services must not be shown in the Step 6 / payment summary. */
export type ContractFinancialService = {
  id: number;
  name_ar: string;
  name_en: string;
  name: string;
  service_name: string;
  price: number;
  service_price: number;
  contract_type: string;
};

export type ContractFinancialData = {
  details?: ContractFinancialLine[] | null;
  price_details?: ContractFinancialPriceDetails | null;
  /** Do not render in create-contract financial summary. */
  services?: ContractFinancialService[] | null;
  /** Do not render in create-contract financial summary. */
  additional_services?: ContractFinancialService[] | null;
  services_total?: number | null;
  meter_fees_total?: number | null;
  subtotal?: number | null;
  tax_percent?: number | null;
  tax_amount?: number | null;
  total_price: number;
  coupon?: number | null;
  total_price_after_coupon?: number | null;
  doc_fee?: number | null;
  doc_fee_lines?: string[] | null;
  duration_preset?: string | null;
};

export type ContractFinancialApiResponse = {
  status: string;
  message: string;
  data: ContractFinancialData;
};

/** Payable amount: after coupon when present, otherwise total_price. */
export function getContractFinancialPayable(
  data: Pick<
    ContractFinancialData,
    "total_price" | "coupon" | "total_price_after_coupon"
  >,
): number {
  const afterCoupon = data.total_price_after_coupon;
  if (
    typeof data.coupon === "number" &&
    Number.isFinite(data.coupon) &&
    data.coupon > 0 &&
    typeof afterCoupon === "number" &&
    Number.isFinite(afterCoupon)
  ) {
    return afterCoupon;
  }

  return data.total_price;
}
