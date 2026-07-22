import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { UnitLookupOption } from "@/features/create-unit/types/unit-option";
import type { PropertyUnitApiItem } from "@/features/property-units/types/property-units-api";
import type {
  PropertyUnitCardData,
  PropertyUnitCategory,
} from "@/features/property-units/types/property-unit";

type UnitLookups = {
  housing: {
    types: UnitLookupOption[];
    usages: UnitLookupOption[];
  };
  commercial: {
    types: UnitLookupOption[];
    usages: UnitLookupOption[];
  };
};

function toUnitCategory(
  contractType: PropertyContractType | null | undefined,
): PropertyUnitCategory {
  return contractType === "commercial" ? "commercial" : "residential";
}

function hasLookupId(
  options: UnitLookupOption[],
  id: number | null | undefined,
) {
  if (!id) {
    return false;
  }

  return options.some((option) => option.id === id);
}

function inferContractTypeFromLookups(
  unit: PropertyUnitApiItem,
  lookups: UnitLookups,
): PropertyContractType | null {
  const inCommercialType = hasLookupId(
    lookups.commercial.types,
    unit.unit_type_id,
  );
  const inHousingType = hasLookupId(lookups.housing.types, unit.unit_type_id);

  if (inCommercialType && !inHousingType) {
    return "commercial";
  }

  if (inHousingType && !inCommercialType) {
    return "housing";
  }

  const inCommercialUsage = hasLookupId(
    lookups.commercial.usages,
    unit.unit_usage_id,
  );
  const inHousingUsage = hasLookupId(
    lookups.housing.usages,
    unit.unit_usage_id,
  );

  if (inCommercialUsage && !inHousingUsage) {
    return "commercial";
  }

  if (inHousingUsage && !inCommercialUsage) {
    return "housing";
  }

  return null;
}

export function resolveUnitContractType(
  unit: PropertyUnitApiItem,
  fallbackContractType: PropertyContractType,
  lookups?: UnitLookups,
): PropertyContractType {
  if (unit.contract_type === "commercial" || unit.contract_type === "housing") {
    return unit.contract_type;
  }

  if (lookups) {
    const inferred = inferContractTypeFromLookups(unit, lookups);
    if (inferred) {
      return inferred;
    }
  }

  return fallbackContractType;
}

function lookupName(options: UnitLookupOption[], id: number | null | undefined) {
  if (!id) {
    return "-";
  }

  return options.find((option) => option.id === id)?.name ?? String(id);
}

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function resolveRoomsCount(unit: PropertyUnitApiItem) {
  return displayValue(unit.tootal_rooms ?? unit.number_of_rooms);
}

function resolveBathroomsCount(unit: PropertyUnitApiItem) {
  return displayValue(unit.The_number_of_toilets ?? unit.The_number_of_the_toilet);
}

export function mapPropertyUnitToCard(
  unit: PropertyUnitApiItem,
  propertyId: number,
  unitContractType: PropertyContractType,
  unitTypes: UnitLookupOption[],
  unitUsages: UnitLookupOption[],
): PropertyUnitCardData {
  return {
    id: String(unit.id),
    unitId: unit.id,
    propertyId,
    contractType: unitContractType,
    unitNumber: displayValue(unit.unit_number),
    category: toUnitCategory(unitContractType),
    details: {
      unitType: lookupName(unitTypes, unit.unit_type_id),
      unitUse: lookupName(unitUsages, unit.unit_usage_id),
      floorNumber: displayValue(unit.floor_number),
      unitArea: displayValue(unit.unit_area),
      roomsCount: resolveRoomsCount(unit),
      hallsCount: displayValue(unit.The_number_of_halls),
      kitchensCount: displayValue(unit.The_number_of_kitchens),
      bathroomsCount: resolveBathroomsCount(unit),
      windowAcCount: displayValue(unit.window_ac),
      splitAcCount: displayValue(unit.split_ac),
    },
  };
}

export function mapPropertyUnitsToCards(
  units: PropertyUnitApiItem[],
  propertyId: number,
  fallbackContractType: PropertyContractType,
  lookups: UnitLookups,
) {
  const cards = units.map((unit) => {
    const unitContractType = resolveUnitContractType(
      unit,
      fallbackContractType,
      lookups,
    );
    const lookupSet =
      unitContractType === "commercial" ? lookups.commercial : lookups.housing;

    return mapPropertyUnitToCard(
      unit,
      propertyId,
      unitContractType,
      lookupSet.types,
      lookupSet.usages,
    );
  });

  return {
    residentialItems: cards.filter((card) => card.category === "residential"),
    commercialItems: cards.filter((card) => card.category === "commercial"),
  };
}
