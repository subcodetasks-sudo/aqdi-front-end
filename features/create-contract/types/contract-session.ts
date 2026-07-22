import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type {
  PropertyUnitApiItem,
  PropertyWithUnitsApiData,
} from "@/features/property-units/types/property-units-api";

type ContractSessionBase = {
  contractId: number;
  uuid: string;
  contractType: PropertyContractType;
};

export type FreshContractSession = ContractSessionBase & {
  isReal: false;
};

export type ExistingPropertyContractSession = ContractSessionBase & {
  isReal: true;
  realId: number;
  realUnitsId: number;
  unitIds: number[];
  unitsCount: number;
};

export type ContractSession = FreshContractSession | ExistingPropertyContractSession;

export type ExistingPropertyContractContext = {
  property: PropertyWithUnitsApiData;
  units: PropertyUnitApiItem[];
};
