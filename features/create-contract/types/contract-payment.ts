export type ContractPaymentData = {
  paymentUrl: string;
  paymentSuccessUrl: string | null;
  paymentErrorUrl: string | null;
  invoiceId: string | null;
  contractUuid: string;
  cartAmount: number | null;
};

export type ContractPaymentGatewayRecord = {
  status?: string | null;
};

export type ContractEmployeePaidRecord = {
  is_paid?: boolean | number | null;
};

export type ContractPaymentStatusData = {
  result: "success" | "error";
  contractUuid: string;
  contractId: number;
  isCompleted: boolean;
  employeePaidRecord: ContractEmployeePaidRecord | null;
  payment: ContractPaymentGatewayRecord | null;
};

export type ContractPaymentApiResponse = {
  Payment_url?: string;
  payment_url?: string;
  payment_success_url?: string;
  payment_error_url?: string;
  invoice_id?: string;
  contract_uuid?: string;
  cart_amount?: number;
  message?: string;
  success?: boolean;
  data?: {
    Payment_url?: string;
    payment_url?: string;
    payment_success_url?: string;
    payment_error_url?: string;
    invoice_id?: string;
    contract_uuid?: string;
    cart_amount?: number;
  };
};

export type ContractPaymentStatusApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: {
    result: "success" | "error";
    contract_uuid: string;
    contract_id: number;
    is_completed: boolean;
    employee_paid_record: unknown;
    payment: unknown;
  };
};
