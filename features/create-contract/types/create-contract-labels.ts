import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import type {
  DelegationTypeOption,
  TenantStatusOption,
} from "@/features/create-contract/types/tenant-step";

export type CreateContractLabels = {
  backLabel: string;
  pageTitleResidential: string;
  pageTitleCommercial: string;
  header: {
    home: string;
    help: string;
    requestPrefix: string;
    copySuccess: string;
    copyError: string;
    whatsappHref: string;
  };
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
      methods: Record<
        "photo" | "link" | "manual",
        {
          title: string;
          description: string;
        }
      >;
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
        title: string;
        description: string;
      };
    };
    agentData: {
      sectionTitle: string;
      sectionDescription: string;
      footerNote: string;
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
        options: Record<
          DelegationTypeOption,
          {
            title: string;
            description: string;
            badge?: string;
          }
        >;
      };
      unifiedRecordNumber: {
        label: string;
        placeholder: string;
        hint: string;
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
      meterRegistration: {
        title: string;
        currency: string;
        tenant: {
          title: string;
          subtitle: string;
          feeBadge: string;
          feeFooter: string;
        };
        owner: {
          title: string;
          subtitle: string;
          noFee: string;
        };
        notice: {
          beforeFee: string;
          feeAmount: string;
          afterFee: string;
          nonRefundable: string;
          afterNonRefundable: string;
          lessThanMonth: string;
          afterLessThanMonth: string;
        };
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
      otherOption: string;
      feeLabel: string;
      currency: string;
      custom: {
        yearOption: string;
        monthOption: string;
        monthOptionZero: string;
        loadingPreview: string;
        previewError: string;
      };
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
    tenantPermissions: {
      title: string;
      subtitle: string;
      instruction: string;
      optionsError: string;
    };
    otherConditions: {
      title: string;
      subtitle: string;
      instruction: string;
      placeholder: string;
      add: string;
      remove: string;
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
      electricityMeterFee: string;
      waterMeterFee: string;
      meterFeesTotal: string;
      services: string;
      servicesTotal: string;
      docFee: string;
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
    discountCode: {
      question: string;
      add: string;
      placeholder: string;
      apply: string;
      clear: string;
    };
    disclaimer: {
      prefix: string;
      termsLink: string;
      and: string;
      privacyLink: string;
      termsHref: string;
      privacyHref: string;
    };
    methodDialog: {
      title: string;
      question: string;
      submitting: string;
      draft: {
        title: string;
        description: string;
      };
      payNow: {
        title: string;
        description: string;
      };
      missingContractSession: string;
      draftError: string;
    };
    draftSuccessDialog: {
      title: string;
      paymentStatusLabel: string;
      paymentStatusDescription: string;
      orderNumberLabel: string;
      copy: string;
      copySuccess: string;
      copyError: string;
      preparationDescription: string;
      whatsappCta: string;
      whatsappHref: string;
    };
  };
  prices: {
    residential: string;
    commercial: string;
    additionalYear: string;
  };
};
