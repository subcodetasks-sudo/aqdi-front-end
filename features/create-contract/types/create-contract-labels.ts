import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type { HasAgentOption } from "@/features/create-contract/types/owner-step";
import type {
  DelegationTypeOption,
  TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";

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
    startContractLoading: string;
    startContractError: string;
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
      submitting: string;
    };
    submitError: string;
    submitAddressError: string;
    missingContractSession: string;
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
      frontLabel?: string;
      backLabel?: string;
      inheritanceLabel?: string;
      heirsPoaLabel?: string;
      endowmentCertLabel?: string;
      trusteeshipLabel?: string;
      guardiansPoaLabel?: string;
      clickHere: string;
      chooseFile: string;
      acceptedFormats: string;
      preview: string;
      delete: string;
      previewTitle: string;
      closePreview: string;
    };
    nationalAddress: {
      methodSelect: {
        label: string;
        placeholder: string;
      };
      methods: Record<"map" | "photo" | "link" | "manual", string>;
      mapTitle: string;
      mapHint: string;
      coordinatesLabel: string;
      link: {
        label: string;
        placeholder: string;
      };
      manual: {
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
      photo: CreateContractLabels["deed"]["deedImage"];
    };
    waqf: {
      multipleTrusteesLabel: string;
    };
  };
  owner: {
    cancelRequest: string;
    navigation: {
      previous: string;
      continue: string;
      saveLater: string;
      savingLater: string;
      submitting: string;
    };
    submitError: string;
    missingContractSession: string;
    saveLaterError: string;
    validation: {
      hintTitle: string;
      issues: Record<
        | "fullName"
        | "idNumber"
        | "idNumberLength"
        | "birthDate"
        | "phone"
        | "phoneLength"
        | "iban"
        | "ibanInvalid"
        | "hasAgent"
        | "powerOfAttorney",
        string
      >;
      fieldErrors: {
        idNumberLength: string;
        phoneLength: string;
        iban: string;
      };
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
      iban: {
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
    submitError: string;
    submitUnitError: string;
    missingContractSession: string;
    saveLaterError: string;
    navigation: {
      previous: string;
      continue: string;
      saveLater: string;
      savingLater: string;
      submitting: string;
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
      optionsError: string;
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
      additionalInfo: {
        toggle: string;
        writeHerePlaceholder: string;
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
    leaseRenewal: {
      heading: string;
      subtitle: string;
      addNotesToggle: string;
      edit: string;
      confirmContinue: string;
      notesDialog: {
        title: string;
        close: string;
        heading: string;
        subtitle: string;
        notesLabel: string;
        notesPlaceholder: string;
        stepIndicator: string;
        save: string;
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
  finance: {
    title: string;
    subtitle: string;
    submitError: string;
    missingContractSession: string;
    navigation: {
      previous: string;
      continue: string;
      submitting: string;
    };
    selectPlaceholder: string;
    contractStartDate: {
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
    contractDuration: {
      label: string;
      loading: string;
      optionsError: string;
    };
    totalRentAmount: {
      label: string;
      placeholder: string;
    };
    paymentMethod: {
      label: string;
      loading: string;
      optionsError: string;
    };
    addTenantPermissions: {
      label: string;
      edit: string;
    };
    addOtherConditions: {
      label: string;
      add: string;
    };
    tenantPermissionsDialog: {
      title: string;
      close: string;
      heading: string;
      subtitle: string;
      continue: string;
      optionsError: string;
    };
    otherConditionsDialog: {
      title: string;
      close: string;
      heading: string;
      subtitle: string;
      termsLabel: string;
      termsPlaceholder: string;
      save: string;
    };
  };
  payment: {
    title: string;
    subtitle: string;
    navigation: {
      previous: string;
      pay: string;
      paying: string;
      payError: string;
    };
    summary: {
      ejarFees: string;
      contractPeriodPrice: string;
      vat: string;
      applicationFees: string;
      services: string;
      total: string;
      currency: string;
      ejarLogoAlt: string;
    };
    savePropertyData: {
      label: string;
      dialog: {
        title: string;
        close: string;
        heading: string;
        subtitle: string;
        nameLabel: string;
        namePlaceholder: string;
        nameHint: string;
        nameExample: string;
        save: string;
        saving: string;
        submitError: string;
        submitSuccess: string;
        missingContractSession: string;
      };
    };
    disclaimer: {
      prefix: string;
      termsLink: string;
      and: string;
      privacyLink: string;
      termsHref: string;
      privacyHref: string;
    };
  };
  prices: {
    residential: string;
    commercial: string;
    additionalYear: string;
  };
};
