import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type { ContractInstrumentType } from "@/features/create-contract/types/instrument-type";

const DEED_TYPE_TO_INSTRUMENT_TYPE = {
  "electronic-justice-ministry": "electronic_deed_from_the_ministry_of_justice",
  "electronic-real-estate-registry": "electronic_tax_register",
  paper: "old_handwritten",
  "deceased-owner": "property_ownership_owner_are_deceased",
  "waqf-owner": "property_ownership_owner_is_endowment",
  "sale-paper": "sale_agreement",
  "economic-cities-authority": "economic_cities_authority_suspended",
  "adverse-possession": "strong_argument",
  "sublease-contract": "sublease_agreement",
  "lease-renewal": "lease_renewal",
} as const satisfies Record<DeedTypeId, ContractInstrumentType>;

const ELECTRONIC_JUSTICE_INSTRUMENT_TYPES = new Set<string>([
  "electronic",
  "electronic_deed",
  "electronic_deed_from_the_ministry_of_justice",
]);

export function mapDeedTypeToInstrumentType(
  deedType: DeedTypeId,
): ContractInstrumentType {
  return DEED_TYPE_TO_INSTRUMENT_TYPE[deedType];
}

export function instrumentTypesMatch(
  stored: string,
  selected: string,
) {
  if (stored === selected) {
    return true;
  }

  return (
    ELECTRONIC_JUSTICE_INSTRUMENT_TYPES.has(stored) &&
    ELECTRONIC_JUSTICE_INSTRUMENT_TYPES.has(selected)
  );
}

/**
 * Manual deed number/date is stored only for canonical `electronic`.
 * File uploads keep the long alias the contract endpoint already accepts.
 */
export function resolveContractStep1InstrumentType(
  deedType: DeedTypeId,
  hasManualEntry: boolean,
): ContractInstrumentType {
  const mapped = mapDeedTypeToInstrumentType(deedType);

  if (
    hasManualEntry &&
    mapped === "electronic_deed_from_the_ministry_of_justice"
  ) {
    return "electronic";
  }

  return mapped;
}
