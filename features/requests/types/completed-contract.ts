export type CompletedContractUnit = {
  unit_type_name?: string | null;
  unit_usage_name?: string | null;
  unit_number?: string | null;
  unit_area?: number | string | null;
  floor_number?: number | string | null;
  electricity_meter_number?: string | null;
  water_meter_number?: string | null;
};

export type CompletedContractData = {
  id: number;
  uuid: string;
  contract_type: string;
  property_owner_id_num: string | null;
  tenant_id_num: string | null;
  duration_preset: string | null;
  duration_years: number | null;
  duration_months: number | null;
  total_months: number | null;
  units: CompletedContractUnit[] | null;
  created_at: string;
};

export type CompletedContractApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: CompletedContractData;
};
