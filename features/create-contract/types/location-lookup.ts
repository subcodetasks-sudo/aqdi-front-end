export type LocationLookupOption = {
  id: number;
  name: string;
};

export type LocationLookupApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: LocationLookupOption[];
};
