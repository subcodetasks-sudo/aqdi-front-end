import type { RentedUnitDataState } from "@/features/create-contract/types/rented-unit-step";
import { buildUnitFieldsPayload } from "@/features/create-unit/utils/build-unit-api-payload";

export type ContractStep5Payload = {
  contractId: number;
  rentedUnits: RentedUnitDataState[];
};

export function buildContractStep5Body({ contractId, rentedUnits }: ContractStep5Payload) {
  return {
    id: contractId,
    units: rentedUnits.map((unit) => buildUnitFieldsPayload(unit)),
  };
}
