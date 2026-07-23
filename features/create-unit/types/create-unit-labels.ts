import type { FurnishingTypeOption } from "@/features/create-unit/types/unit-data";

export type CreateUnitLabels = {
  backLabel: string;
  pageTitle: string;
  editPageTitle: string;
  navigation: {
    previous: string;
    continue: string;
    save: string;
    submitting: string;
    submitError: string;
    updateSuccess: string;
    createSuccess: string;
  };
  title: string;
  editTitle: string;
  subtitle: string;
  editSubtitle: string;
  selectPlaceholder: string;
  contractType: {
    label: string;
    linkedLabel: string;
    options: {
      housing: string;
      commercial: string;
    };
  };
  unitType: {
    label: string;
  };
  unitUsage: {
    label: string;
  };
  totalArea: {
    label: string;
    placeholder: string;
    suffix: string;
  };
  floorNumber: {
    label: string;
  };
  floorOptions: {
    ground: string;
  };
  unitNumber: {
    label: string;
    placeholder: string;
  };
  unitCardTitle?: string;
  additionalInfo: {
    toggle: string;
    writeHerePlaceholder: string;
  };
  roomsCount: {
    label: string;
    hint?: string;
  };
  hallsCount: {
    label: string;
  };
  majlisCount: {
    label: string;
  };
  kitchensCount: {
    label: string;
  };
  bathroomsCount: {
    label: string;
  };
  windowAcCount: {
    label: string;
  };
  splitAcCount: {
    label: string;
  };
  kitchenCabinetsInstalled: {
    label: string;
    kitchensRequiredHint?: string;
  };
  furnished: {
    label: string;
  };
  furnishingType: {
    label: string;
    new: string;
    used: string;
  };
  addElectricityMeter: {
    label: string;
  };
  electricityMeterNumber: {
    label: string;
    placeholder: string;
  };
  addWaterMeter: {
    label: string;
  };
  waterMeterNumber: {
    label: string;
    placeholder: string;
  };
  addUnit: string;
  removeUnit: string;
  unitsCount: string;
  unitListTitle: string;
  floorSummaryPrefix: string;
  success: {
    title: string;
    description: string;
    mainMenu: string;
    mainMenuHref: string;
    actions: {
      viewProperty: string;
      viewPropertyHref: string;
      addUnit: string;
      addUnitHref: string;
      createContract: string;
      createContractHref: string;
      ejarLogoAlt: string;
    };
  };
};
