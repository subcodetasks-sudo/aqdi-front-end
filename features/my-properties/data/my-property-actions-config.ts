import type { MyPropertyCardData } from "@/features/my-properties/types/property-card";
import type { MyPropertyActionId } from "@/features/my-properties/types/property-card";

export type MyPropertyActionIconType = "svg" | "plus" | "ejar";

export type MyPropertyActionConfig = {
  id: MyPropertyActionId;
  labelKey: MyPropertyActionId;
  iconType: MyPropertyActionIconType;
  iconSrc?: string;
};

export const MY_PROPERTY_ACTIONS_CONFIG: MyPropertyActionConfig[] = [
  {
    id: "view-edit",
    labelKey: "view-edit",
    iconType: "svg",
    iconSrc: "/icons/building.svg",
  },
  {
    id: "view-units",
    labelKey: "view-units",
    iconType: "svg",
    iconSrc: "/icons/pentagon.svg",
  },
  {
    id: "add-unit",
    labelKey: "add-unit",
    iconType: "plus",
  },
  // {
  //   id: "create-contract",
  //   labelKey: "create-contract",
  //   iconType: "ejar",
  // },
];

export function buildPropertyActionHref(
  actionId: MyPropertyActionId,
  property: MyPropertyCardData,
) {
  const { propertyId, contractType } = property;
  const unitParams = new URLSearchParams({
    propertyId: String(propertyId),
    contract_type: contractType,
  });

  switch (actionId) {
    case "view-edit":
      return `/properties/create?type=${contractType === "commercial" ? "commercial" : "residential"}&propertyId=${propertyId}`;
    case "view-units":
      return `/properties/my-properties/units?propertyId=${propertyId}&contract_type=${contractType}`;
    case "add-unit":
      return `/properties/create-unit?${unitParams.toString()}`;
    case "create-contract":
      return `/create-contract?propertyId=${propertyId}`;
    default:
      return "/properties/my-properties";
  }
}

export const MY_PROPERTY_EJAR_LOGO = "/images/ejar.png";
