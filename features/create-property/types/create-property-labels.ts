import type { CreatePropertyStepperStep } from "@/features/create-property/types/create-property-step";
import type { PropertyDeedTypeId } from "@/features/create-property/types/deed-type";
import type { PropertyHasAgentOption } from "@/features/create-property/types/owner-step";
export type CreatePropertyLabels = {
  backLabel: string;
  pageTitle: string;
  stepper: {
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
      clickHere: string;
      chooseFile: string;
      acceptedFormats: string;
      preview: string;
      delete: string;
      previewTitle: string;
      closePreview: string;
    };
  };
  address: {
    navigation: {
      previous: string;
      continue: string;
    };
    title: string;
    subtitle: string;
    nationalAddress: {
      methods: string[];
      mapTitle: string;
      link: {
        label: string;
        placeholder: string;
      };
      photo: CreatePropertyLabels["deed"]["deedImage"];
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
        options: Record<PropertyHasAgentOption, string>;
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
      powerOfAttorney: CreatePropertyLabels["deed"]["deedImage"];
    };
  };
  review: {
    navigation: {
      previous: string;
      continue: string;
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
