import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";

/**
 * Map UI deed option ids to API `instrument_type` values.
 * Alias: electronic_deed_from_the_ministry_of_justice → electronic
 */
export function mapPropertyDeedTypeToApiInstrumentType(
  deedType: PropertyDeedTypeId,
): string {
  if (deedType === "electronic_deed_from_the_ministry_of_justice") {
    return "electronic";
  }

  return deedType;
}
