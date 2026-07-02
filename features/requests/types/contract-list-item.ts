import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export type ContractListItem = {
  id: number;
  uuid: string;
  contract_type: PropertyContractType;
  name_real_estate: string | null;
  property_owner_id_num: string | null;
  tenant_id_num: string | null;
  instrument_type: string | null;
  is_completed: boolean;
  is_draft: boolean;
  step: number;
  contract_status_id: number | null;
  contract_status_name: string | null;
  created_at: string;
  time_to_documentation_contract: string | null;
};

export type ContractsPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ContractsListApiData = {
  data: ContractListItem[];
  pagination: ContractsPagination;
};

export type ContractsListApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: ContractsListApiData;
};
