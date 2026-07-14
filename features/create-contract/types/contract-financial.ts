export type ContractFinancialPriceDetails = {
  contract_period_price: number;
  application_fees: number;
  tax: number;
};

export type ContractFinancialService = {
  service_name: string;
  service_price: string;
};

export type ContractFinancialData = {
  price_details: ContractFinancialPriceDetails;
  services: ContractFinancialService[];
  total_price: number;
  doc_fee?: number | null;
  doc_fee_lines?: string[] | null;
  duration_preset?: string | null;
};

export type ContractFinancialApiResponse = {
  status: string;
  message: string;
  data: ContractFinancialData;
};
