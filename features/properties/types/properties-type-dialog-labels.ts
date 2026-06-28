import type { PropertyTypeId } from "@/features/properties/types/property-type";

export type PropertiesTypeDialogLabels = {
  title: string;
  close: string;
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
