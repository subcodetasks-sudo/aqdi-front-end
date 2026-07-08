import type { DeedTypeId } from "@/features/create-contract/types/deed-type";

// The API stores `instrument_type` using the backend instrument enum, which does
// not always match 1:1 with the create-contract deed type ids. This maps the
// values a property can return to the closest deed type used by the wizard.
const INSTRUMENT_TYPE_TO_DEED_TYPE: Record<string, DeedTypeId> = {
  electronic: "electronic-justice-ministry",
  electronic_deed_from_the_ministry_of_justice: "electronic-justice-ministry",
  electronic_tax_register: "electronic-real-estate-registry",
  old_handwritten: "paper",
  property_ownership_owner_are_deceased: "deceased-owner",
  property_ownership_owner_are_deceased_endowment: "deceased-owner",
  property_ownership_owner_is_endowment: "waqf-owner",
  property_ownership_owner_are_suspended: "waqf-owner",
  sale_agreement: "sale-paper",
  economic_cities_authority_suspended: "economic-cities-authority",
  strong_argument: "adverse-possession",
  sublease_agreement: "sublease-contract",
  lease_renewal: "lease-renewal",
};

export function mapInstrumentTypeToDeedType(
  instrumentType: string | null | undefined,
): DeedTypeId | "" {
  if (!instrumentType) {
    return "";
  }

  return INSTRUMENT_TYPE_TO_DEED_TYPE[instrumentType] ?? "";
}
