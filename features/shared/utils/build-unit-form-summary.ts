import type { UnitLookupOption } from "@/features/create-unit/types/unit-option";
import type { UnitDataState } from "@/features/create-unit/types/unit-data";

type BuildUnitSummaryOptions = {
  unitTypeOptions: UnitLookupOption[];
  groundFloorLabel: string;
  floorPrefix: string;
};

export function buildUnitFormSummary(
  unit: UnitDataState,
  options: BuildUnitSummaryOptions,
) {
  const parts: string[] = [];

  const unitTypeName = options.unitTypeOptions.find(
    (option) => String(option.id) === unit.unitTypeId,
  )?.name;
  if (unitTypeName) {
    parts.push(unitTypeName);
  }

  const unitNumber = unit.unitNumber.trim();
  if (unitNumber) {
    parts.push(unitNumber.startsWith("#") ? unitNumber : `#${unitNumber}`);
  }

  if (unit.floorNumber) {
    if (unit.floorNumber === "ground") {
      parts.push(options.groundFloorLabel);
    } else {
      parts.push(`${options.floorPrefix} ${unit.floorNumber}`);
    }
  }

  return parts.length > 0 ? parts.join(" • ") : null;
}
