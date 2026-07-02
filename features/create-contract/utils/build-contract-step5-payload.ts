import type { RentedUnitDataState } from "@/features/create-contract/types/rented-unit-step";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";
import { buildUnitApiPayload } from "@/features/create-unit/utils/build-unit-api-payload";
import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export type ContractStep5Payload = {
  contractId: number;
  contractType: PropertyContractType;
  rentedUnitData: RentedUnitDataState;
};

export function rentedUnitDataToUnitDataState(
  rentedUnitData: RentedUnitDataState,
): UnitDataState {
  return {
    unitTypeId: rentedUnitData.unitTypeId,
    unitUsageId: rentedUnitData.unitUsageId,
    totalArea: rentedUnitData.totalArea,
    floorNumber: rentedUnitData.floorNumber,
    unitNumber: rentedUnitData.unitNumber,
    roomsCount: rentedUnitData.roomsCount,
    hallsCount: rentedUnitData.hallsCount,
    kitchensCount: rentedUnitData.kitchensCount,
    bathroomsCount: rentedUnitData.bathroomsCount,
    windowAcCount: rentedUnitData.windowAcCount,
    splitAcCount: rentedUnitData.splitAcCount,
    kitchenCabinetsInstalled: rentedUnitData.kitchenCabinetsInstalled,
    furnished: rentedUnitData.furnished,
    furnishingType: rentedUnitData.furnishingType,
    addElectricityMeter: rentedUnitData.addElectricityMeter,
    electricityMeterNumber: rentedUnitData.electricityMeterNumber,
    addWaterMeter: rentedUnitData.addWaterMeter,
    waterMeterNumber: rentedUnitData.waterMeterNumber,
  };
}

export function buildContractStep5Body({
  contractId,
  contractType,
  rentedUnitData,
}: ContractStep5Payload) {
  const unitData = rentedUnitDataToUnitDataState(rentedUnitData);
  const { real_estates_units_id: _propertyId, ...unitPayload } = buildUnitApiPayload(
    0,
    contractType,
    unitData,
  );

  return {
    id: contractId,
    ...unitPayload,
    type_furnished:
      unitData.furnished && unitData.furnishingType
        ? unitData.furnishingType
        : "",
  };
}
