export type InvoiceStatus = "paid" | "unpaid" | "refunded" | "returned" | string;

export type ContractInvoiceItem = {
  index: number | string;
  description: string;
  amount_label: string;
};

export type ContractInvoice = {
  contractId: number;
  platform_name: string;
  platform_subtitle: string;
  title: string;
  invoice_number: string;
  datetime_label: string;
  reference_number: string | null;
  customer_name: string | null;
  order_number: string;
  contract_type_label: string;
  items: ContractInvoiceItem[];
  total_due_label: string;
  total_amount_label: string;
  status: InvoiceStatus | null;
  status_label: string;
  status_color: string | null;
  print_label: string;
  is_paid: boolean;
  is_refunded: boolean;
  total_amount: number | null;
};

export type ContractInvoiceApiResponse = {
  message?: string;
  code?: number;
  success?: boolean;
  status?: string;
  data?: Record<string, unknown>;
};
