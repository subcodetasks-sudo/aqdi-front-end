import type { PropertiesTypeDialogLabels } from "@/features/properties/types/properties-type-dialog-labels";

export type MyPropertiesLabels = {
  backLabel: string;
  pageTitle: string;
  emptyState: string;
  addProperty: string;
  contractTypes: {
    housing: string;
    commercial: string;
  };
  typeDialogLabels: PropertiesTypeDialogLabels;
};
