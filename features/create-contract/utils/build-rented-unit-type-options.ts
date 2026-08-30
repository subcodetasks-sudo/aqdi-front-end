import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { UnitLookupOption } from "@/features/create-unit/types/unit-option";

export type RentedUnitTypeSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  notice?: string;
};

type BuildRentedUnitTypeOptionsInput = {
  housingUnitTypes: UnitLookupOption[];
  commercialUnitTypes: UnitLookupOption[];
  contractType: PropertyContractType;
  /** Notice shown above the disabled (other contract type) options. */
  otherContractTypeNotice: string;
};

/**
 * Builds the unit-type select options for the rented-unit (المستأجر) step.
 *
 * Options that match the current contract type are listed first and selectable.
 * Options that belong to the other contract type follow, disabled, preceded by a
 * notice explaining how to switch contract type.
 */
export function buildRentedUnitTypeOptions({
  housingUnitTypes,
  commercialUnitTypes,
  contractType,
  otherContractTypeNotice,
}: BuildRentedUnitTypeOptionsInput): RentedUnitTypeSelectOption[] {
  const currentUnitTypes =
    contractType === "commercial" ? commercialUnitTypes : housingUnitTypes;
  const otherUnitTypes =
    contractType === "commercial" ? housingUnitTypes : commercialUnitTypes;

  const currentIds = new Set(currentUnitTypes.map((option) => option.id));

  const currentOptions: RentedUnitTypeSelectOption[] = currentUnitTypes.map(
    (option) => ({
      value: String(option.id),
      label: option.name,
    }),
  );

  const otherOptions: RentedUnitTypeSelectOption[] = otherUnitTypes
    .filter((option) => !currentIds.has(option.id))
    .map((option, index) => ({
      value: String(option.id),
      label: option.name,
      disabled: true,
      notice: index === 0 ? otherContractTypeNotice : undefined,
    }));

  return [...currentOptions, ...otherOptions];
}
