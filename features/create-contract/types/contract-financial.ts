export type ContractFinancialPriceDetails = {
  contract_period_price: number;
  application_fees: number;
  tax: number;
  electricity_meter_fee: number;
  water_meter_fee: number;
};

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
  price_details: ContractFinancialPriceDetails;
  services: ContractFinancialService[];
  additional_services: ContractFinancialService[];
  services_total: number;
  meter_fees_total: number;
  total_price: number;
};

export type ContractFinancialApiResponse = {
  status: string;
  message: string;
  data: ContractFinancialData;
};
