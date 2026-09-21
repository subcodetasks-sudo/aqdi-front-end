export type PropertyMeterOwnership = "owner" | "tenant";

export type PropertyDetailsState = {
  propertyTypeId: number | "";
  propertyUsagesId: number | "";
  numberOfFloors: string;
  numberOfUnitsInRealEstate: string;
  numberOfUnitsPerFloor: string;
  ageOfTheProperty: string;
  electricityMeterOwnership: PropertyMeterOwnership | "";
  waterMeterOwnership: PropertyMeterOwnership | "";
  contractOwnership: PropertyMeterOwnership;
  /** strong_argument */
  realEstateRegistryNumber: string;
  typeDateFirstRegistration: "hijri" | "gregorian";
  dateFirstRegistrationDay: string;
  dateFirstRegistrationMonth: string;
  dateFirstRegistrationYear: string;
};

export const EMPTY_PROPERTY_DETAILS: PropertyDetailsState = {
  propertyTypeId: "",
  propertyUsagesId: "",
  numberOfFloors: "",
  numberOfUnitsInRealEstate: "",
  numberOfUnitsPerFloor: "",
  ageOfTheProperty: "",
  electricityMeterOwnership: "",
  waterMeterOwnership: "",
  contractOwnership: "owner",
  realEstateRegistryNumber: "",
  typeDateFirstRegistration: "hijri",
  dateFirstRegistrationDay: "",
  dateFirstRegistrationMonth: "",
  dateFirstRegistrationYear: "",
};

export function isPropertyDetailsComplete(value: PropertyDetailsState) {
  return (
    value.propertyTypeId !== "" &&
    value.propertyUsagesId !== "" &&
    value.numberOfFloors.trim() !== "" &&
    value.numberOfUnitsInRealEstate.trim() !== "" &&
    value.numberOfUnitsPerFloor.trim() !== "" &&
    value.ageOfTheProperty.trim() !== "" &&
    value.electricityMeterOwnership !== "" &&
    value.waterMeterOwnership !== ""
  );
}

export function isStrongArgumentDetailsComplete(value: PropertyDetailsState) {
  const day = value.dateFirstRegistrationDay.replace(/\D/g, "");
  const month = value.dateFirstRegistrationMonth.replace(/\D/g, "");
  const year = value.dateFirstRegistrationYear.replace(/\D/g, "");

  return (
    value.realEstateRegistryNumber.trim() !== "" &&
    day !== "" &&
    month !== "" &&
    year !== ""
  );
}
