import type { PropertyContractType } from "@/features/create-property/utils/contract-type";

export type MyPropertyCardData = {
  id: string;
  propertyId: number;
  contractType: PropertyContractType;
  title: string;
  date: string;
  deedImageUrl: string | null;
  step: number;
};

export type MyPropertyActionId =
  | "view-edit"
  | "view-units"
  | "add-unit"
  | "create-contract";
