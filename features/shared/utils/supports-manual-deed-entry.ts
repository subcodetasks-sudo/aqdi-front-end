import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import {
  deedTypeIsAdversePossession,
  deedTypeIsDeceasedOwner,
  deedTypeIsEconomicCitiesAuthority,
  deedTypeIsLeaseRenewal,
  deedTypeIsPaper,
  deedTypeIsSalePaper,
  deedTypeIsSublease,
  deedTypeIsWaqfOwner,
} from "@/features/create-contract/types/deed-type";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import {
  propertyDeedTypeIsAdversePossession,
  propertyDeedTypeIsDeceasedOwner,
  propertyDeedTypeIsEconomicCitiesAuthority,
  propertyDeedTypeIsPaper,
  propertyDeedTypeIsSalePaper,
  propertyDeedTypeIsWaqfOwner,
} from "@/features/create-property/types/deed-type";

export function deedTypeSupportsManualEntry(deedType: DeedTypeId | "") {
  return (
    deedType !== "" &&
    !deedTypeIsLeaseRenewal(deedType) &&
    !deedTypeIsSublease(deedType) &&
    !deedTypeIsDeceasedOwner(deedType) &&
    !deedTypeIsWaqfOwner(deedType) &&
    !deedTypeIsEconomicCitiesAuthority(deedType) &&
    !deedTypeIsPaper(deedType) &&
    !deedTypeIsSalePaper(deedType) &&
    !deedTypeIsAdversePossession(deedType)
  );
}

export function propertyDeedTypeSupportsManualEntry(
  deedType: PropertyDeedTypeId | "",
) {
  return (
    deedType !== "" &&
    !propertyDeedTypeIsEconomicCitiesAuthority(deedType) &&
    !propertyDeedTypeIsWaqfOwner(deedType) &&
    !propertyDeedTypeIsPaper(deedType) &&
    !propertyDeedTypeIsDeceasedOwner(deedType) &&
    !propertyDeedTypeIsSalePaper(deedType) &&
    !propertyDeedTypeIsAdversePossession(deedType)
  );
}
