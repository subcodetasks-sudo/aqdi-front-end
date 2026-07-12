export type ManualNationalAddressData = {
  propertyPlaceId: number | "";
  propertyCityId: number | "";
  neighborhood: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  extraFigure: string;
};

export const EMPTY_MANUAL_NATIONAL_ADDRESS: ManualNationalAddressData = {
  propertyPlaceId: "",
  propertyCityId: "",
  neighborhood: "",
  street: "",
  buildingNumber: "",
  postalCode: "",
  extraFigure: "",
};

export type ManualNationalAddressLabels = {
  place: {
    label: string;
    placeholder: string;
    loading: string;
  };
  city: {
    label: string;
    placeholder: string;
    loading: string;
    selectPlaceFirst: string;
  };
  neighborhood: {
    label: string;
    placeholder: string;
  };
  street: {
    label: string;
    placeholder: string;
  };
  buildingNumber: {
    label: string;
    placeholder: string;
  };
  postalCode: {
    label: string;
    placeholder: string;
  };
  extraFigure: {
    label: string;
    placeholder: string;
  };
};

export function isManualNationalAddressComplete(
  value: ManualNationalAddressData,
) {
  return (
    value.propertyPlaceId !== "" &&
    value.propertyCityId !== "" &&
    value.neighborhood.trim().length > 0 &&
    value.street.trim().length > 0 &&
    value.buildingNumber.trim().length > 0 &&
    value.postalCode.trim().length > 0 &&
    value.extraFigure.trim().length > 0
  );
}

export function appendManualNationalAddressFields(
  formData: FormData,
  value: ManualNationalAddressData,
) {
  formData.append("property_place_id", String(value.propertyPlaceId));
  formData.append("property_city_id", String(value.propertyCityId));
  formData.append("neighborhood", value.neighborhood.trim());
  formData.append("street", value.street.trim());
  formData.append("building_number", value.buildingNumber.trim());
  formData.append("postal_code", value.postalCode.trim());
  formData.append("extra_figure", value.extraFigure.trim());
}
