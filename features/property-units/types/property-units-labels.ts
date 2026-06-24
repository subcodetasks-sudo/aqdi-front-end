import type { PropertyUnitCardData } from "@/features/property-units/types/property-unit";

export type PropertyUnitsLabels = {
  backLabel: string;
  pageTitle: string;
  tabs: {
    residential: string;
    commercial: string;
  };
  residentialItems: PropertyUnitCardData[];
  commercialItems: PropertyUnitCardData[];
};
