import type { ContractFinancialService } from "@/features/create-contract/types/contract-financial";

export function getContractFinancialServiceLabel(
  service: ContractFinancialService,
  locale: string,
) {
  if (locale.startsWith("en")) {
    return service.name_en || service.service_name || service.name;
  }

  return service.name_ar || service.service_name || service.name;
}

export function getContractFinancialServicePrice(
  service: ContractFinancialService,
) {
  return Number(service.service_price ?? service.price) || 0;
}
