import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type {
  FloorCountId,
  PropertyAgeId,
  PropertyTypeId,
  PropertyUseId,
  TotalUnitsId,
  UnitsPerFloorId,
} from "@/features/create-contract/types/property-details";

type PropertyDetailsFieldLabels<T extends string> = {
  label: string;
  placeholder: string;
  options: Record<T, string>;
};

export type CreateContractLabels = {
  backLabel: string;
  pageTitleResidential: string;
  pageTitleCommercial: string;
  stepper: {
    journey: string;
    ejarLogoAlt: string;
    steps: {
      intro: string;
      deed: string;
      owner: string;
      tenant: string;
      finance: string;
    };
  };
  intro: {
    title: string;
    subtitle: string;
    requirements: string[];
    priceLabel: string;
    currency: string;
    viewAllPrices: string;
    start: string;
    priceDialog: {
      title: string;
      close: string;
      yearOrLess: string;
      additionalYear: string;
      disclaimer: string;
    };
  };
  deed: {
    navigation: {
      previous: string;
      continue: string;
    };
    phases: {
      title: string;
      subtitle: string;
    }[];
    deedType: {
      label: string;
      placeholder: string;
      clearSelection: string;
      types: Record<DeedTypeId, string>;
    };
    deedImage: {
      label: string;
      clickHere: string;
      chooseFile: string;
      acceptedFormats: string;
      preview: string;
      delete: string;
      previewTitle: string;
      closePreview: string;
    };
    propertyDetails: {
      propertyType: PropertyDetailsFieldLabels<PropertyTypeId>;
      propertyUse: PropertyDetailsFieldLabels<PropertyUseId>;
      propertyAge: PropertyDetailsFieldLabels<PropertyAgeId>;
      floorCount: PropertyDetailsFieldLabels<FloorCountId>;
      unitsPerFloor: PropertyDetailsFieldLabels<UnitsPerFloorId>;
      totalUnits: PropertyDetailsFieldLabels<TotalUnitsId>;
    };
    nationalAddress: {
      methods: string[];
      mapTitle: string;
      link: {
        label: string;
        placeholder: string;
      };
      photo: CreateContractLabels["deed"]["deedImage"];
    };
  };
  prices: {
    residential: string;
    commercial: string;
    additionalYear: string;
  };
};
