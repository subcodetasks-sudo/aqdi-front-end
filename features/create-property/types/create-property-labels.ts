import type { CreatePropertyStepperStep } from "@/features/create-property/types/create-property-step";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import type { ManualDeedEntryLabels } from "@/features/shared/types/manual-deed-entry-labels";
export type CreatePropertyLabels = {
  backLabel: string;
  pageTitle: string;
  pageTitleResidential: string;
  pageTitleCommercial: string;
  editPageTitleResidential: string;
  editPageTitleCommercial: string;
  header: {
    home: string;
    dark: string;
    light: string;
  };
  stepper: {
    journey: string;
    saveAlt: string;
    steps: Record<CreatePropertyStepperStep, string>;
  };
  deed: {
    navigation: {
      previous: string;
      continue: string;
    };
    title: string;
    subtitle: string;
    deedType: {
      label: string;
      placeholder: string;
      clearSelection: string;
      types: Record<PropertyDeedTypeId, string>;
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
    waqf: {
      multipleTrusteesLabel: string;
    };
    manualEntry: ManualDeedEntryLabels;
  };
  address: {
    navigation: {
      previous: string;
      continue: string;
      submitting: string;
      submitError: string;
    };
    title: string;
    subtitle: string;
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
        hint?: string;
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
      photo: CreatePropertyLabels["deed"]["deedImage"];
    };
  };
  owner: {
    navigation: {
      previous: string;
      continue: string;
    };
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
      sectionDescription?: string;
      footerNote?: string;
      idNumber: {
        label: string;
        placeholder: string;
      };
      birthDateLabel: string;
      phone: {
        label: string;
        placeholder: string;
      };
      powerOfAttorney: CreatePropertyLabels["deed"]["deedImage"];
    };
  };
  review: {
    navigation: {
      previous: string;
      continue: string;
      submitting: string;
      submitError: string;
      updateSuccess: string;
    };
    title: string;
    subtitle: string;
    propertyName: {
      label: string;
      placeholder: string;
      hint: string;
      example: string;
    };
  };
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
