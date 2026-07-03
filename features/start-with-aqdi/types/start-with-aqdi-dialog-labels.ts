import type { PropertyTypeId } from "@/features/properties/types/property-type";

export type StartWithAqdiDialogLabels = {
  title: string;
  close: string;
  mainTitle: string;
  subtitle: string;
  ejarLogoAlt: string;
  aqdiLogoAlt: string;
  divider: string;
  continue: string;
  newContract: {
    title: string;
    description: string;
    imageAlt: string;
  };
  estateContract: {
    title: string;
    description: string;
    imageAlt: string;
  };
  contractTypeDialog: {
    title: string;
    mainTitle: string;
    subtitle: string;
    iconAlt: string;
    options: Record<
      PropertyTypeId,
      {
        title: string;
        description: string;
        iconAlt: string;
      }
    >;
  };
};
