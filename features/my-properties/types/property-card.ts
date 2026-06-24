export type MyPropertyCardData = {
  id: string;
  title: string;
  date: string;
};

export type MyPropertyActionId =
  | "view-edit"
  | "view-units"
  | "add-unit"
  | "create-contract";
