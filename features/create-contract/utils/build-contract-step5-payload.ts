import type { RentedUnitDataState } from "@/features/create-contract/types/rented-unit-step";
import { buildUnitFieldsPayload } from "@/features/create-unit/utils/build-unit-api-payload";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export type ContractStep5Payload = {
  contractId: number;
  contractType: PropertyContractType;
  rentedUnitData: RentedUnitDataState;
};

export function rentedUnitDataToUnitDataState(
  rentedUnitData: RentedUnitDataState,
): RentedUnitDataState {
  return rentedUnitData;
}

export function buildContractStep5Body({
  contractId,
  contractType,
  rentedUnitData,
}: ContractStep5Payload) {
  const unitPayload = buildUnitFieldsPayload(rentedUnitData);

  return {
    id: contractId,
    contract_type: contractType,
    ...unitPayload,
  };
}
