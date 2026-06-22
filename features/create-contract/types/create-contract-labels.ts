import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type { HasAgentOption } from "@/features/create-contract/types/owner-step";
import type {
  DelegationTypeOption,
  TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";
import type {
  UnitTypeOption,
  UnitUsageOption,
} from "@/features/create-contract/types/rented-unit-step";

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
  owner: {
    navigation: {
      previous: string;
      continue: string;
    };
    phases: {
      title: string;
      subtitle: string;
    }[];
    birthDate: {
      label: string;
      hijri: string;
      gregorian: string;
      day: string;
      month: string;
      year: string;
      dayPlaceholder: string;
      monthPlaceholder: string;
      yearPlaceholder: string;
    };
    ownerData: {
      fullName: {
        label: string;
        placeholder: string;
      };
      idNumber: {
        label: string;
        placeholder: string;
      };
      phone: {
        label: string;
        placeholder: string;
      };
      hasAgent: {
        label: string;
        placeholder: string;
        options: Record<HasAgentOption, string>;
      };
    };
    agentData: {
      idNumber: {
        label: string;
        placeholder: string;
      };
      birthDateLabel: string;
      phone: {
        label: string;
        placeholder: string;
      };
      powerOfAttorney: CreateContractLabels["deed"]["deedImage"];
    };
  };
  tenant: {
    cancelRequest: string;
    navigation: {
      previous: string;
      continue: string;
      saveLater: string;
    };
    phases: {
      title: string;
      subtitle: string;
    }[];
    tenantStatus: {
      label: string;
      placeholder: string;
      options: Record<TenantStatusOption, string>;
    };
    birthDate: {
      label: string;
      hijri: string;
      gregorian: string;
      day: string;
      month: string;
      year: string;
      dayPlaceholder: string;
      monthPlaceholder: string;
      yearPlaceholder: string;
    };
    individualData: {
      idNumber: {
        label: string;
        placeholder: string;
      };
      phone: {
        label: string;
        placeholder: string;
      };
    };
    organizationData: {
      delegationType: {
        label: string;
        placeholder: string;
        options: Record<DelegationTypeOption, string>;
      };
      unifiedRecordNumber: {
        label: string;
        placeholder: string;
      };
      ownerIdNumber: {
        label: string;
        placeholder: string;
      };
      ownerBirthDateLabel: string;
      ownerPhone: {
        label: string;
        placeholder: string;
      };
      powerOfAttorney: CreateContractLabels["deed"]["deedImage"];
    };
    rentedUnit: {
      selectPlaceholder: string;
      unitType: {
        label: string;
        options: Record<UnitTypeOption, string>;
      };
      unitUsage: {
        label: string;
        options: Record<UnitUsageOption, string>;
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
      roomsCount: {
        label: string;
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
    };
    saveLaterDialog: {
      title: string;
      close: string;
      successTitle: string;
      successDescription: string;
      orderNumberLabel: string;
      copy: string;
      copied: string;
      copySuccess: string;
      copyError: string;
      retentionNotice: string;
      retentionDays: string;
      orders: string;
      ordersHref: string;
      mainMenu: string;
      mainMenuHref: string;
    };
  };
  prices: {
    residential: string;
    commercial: string;
    additionalYear: string;
  };
};
