export {
  EMPTY_UNIT_DATA as EMPTY_RENTED_UNIT_DATA,
  type UnitDataState as RentedUnitDataState,
} from "@/features/create-unit/types/unit-data";
import {
  isCountAtLeast,
  isUnitDataComplete,
  type UnitDataState,
} from "@/features/create-unit/types/unit-data";

export const TENANT_STEP_PHASE_COUNT = 2;

export function isRentedUnitDataComplete(
  unitData: UnitDataState,
  options?: { requireRooms?: boolean },
) {
  if (!isUnitDataComplete(unitData, { requireMeterRegistration: true })) {
    return false;
  }

  if (options?.requireRooms && !isCountAtLeast(unitData.roomsCount, 1)) {
    return false;
  }

  return true;
}

export function areRentedUnitsComplete(
  units: UnitDataState[],
  options?: { requireRooms?: boolean },
) {
  return (
    units.length > 0 &&
    units.every((unit) => isRentedUnitDataComplete(unit, options))
  );
}
