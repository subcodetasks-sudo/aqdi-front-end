import type { MyPropertyActionId } from "@/features/my-properties/types/property-card";

export type MyPropertyActionIconType = "svg" | "plus" | "ejar";

export type MyPropertyActionConfig = {
  id: MyPropertyActionId;
  labelKey: MyPropertyActionId;
  href: string;
  iconType: MyPropertyActionIconType;
  iconSrc?: string;
};

export const MY_PROPERTY_ACTIONS_CONFIG: MyPropertyActionConfig[] = [
  {
    id: "view-edit",
    labelKey: "view-edit",
    href: "/properties/create",
    iconType: "svg",
    iconSrc: "/icons/building.svg",
  },
  {
    id: "view-units",
    labelKey: "view-units",
    href: "/properties/my-properties/units",
    iconType: "svg",
    iconSrc: "/icons/pentagon.svg",
  },
  {
    id: "add-unit",
    labelKey: "add-unit",
    href: "/properties/create-unit",
    iconType: "plus",
  },
  {
    id: "create-contract",
    labelKey: "create-contract",
    href: "/create-contract",
    iconType: "ejar",
  },
];

export const MY_PROPERTY_EJAR_LOGO = "/images/ejar.png";
