export type PropertyLookupOption = {
  id: number;
  name: string;
};

export type PropertyLookupApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: PropertyLookupOption[];
};
