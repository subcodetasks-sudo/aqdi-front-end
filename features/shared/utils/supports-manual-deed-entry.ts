import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import {
  deedTypeIsDeceasedOwner,
  deedTypeIsLeaseRenewal,
  deedTypeIsSublease,
} from "@/features/create-contract/types/deed-type";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";

export function deedTypeSupportsManualEntry(deedType: DeedTypeId | "") {
  return (
    deedType !== "" &&
    !deedTypeIsLeaseRenewal(deedType) &&
    !deedTypeIsSublease(deedType) &&
    !deedTypeIsDeceasedOwner(deedType)
  );
}

export function propertyDeedTypeSupportsManualEntry(
  deedType: PropertyDeedTypeId | "",
) {
  return deedType !== "";
}
