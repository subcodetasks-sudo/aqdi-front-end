export {
  EMPTY_UNIT_DATA as EMPTY_RENTED_UNIT_DATA,
  type UnitDataState as RentedUnitDataState,
} from "@/features/create-unit/types/unit-data";
import {
  isUnitDataComplete,
  type UnitDataState,
} from "@/features/create-unit/types/unit-data";

export const TENANT_STEP_PHASE_COUNT = 2;

export function isRentedUnitDataComplete(unitData: UnitDataState) {
  return isUnitDataComplete(unitData, { requireMeterRegistration: true });
}
