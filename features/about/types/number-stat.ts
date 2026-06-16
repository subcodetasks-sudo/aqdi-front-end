export type NumberStatId =
  | "satisfaction"
  | "experience"
  | "commercial"
  | "residential";

export type NumberStatConfig = {
  id: NumberStatId;
  icon: string;
};

export type NumberStatTranslations = {
  value: string;
  label: string;
};
