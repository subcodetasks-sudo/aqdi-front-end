export type UnitLookupOption = {
  id: number;
  name: string;
};

export type UnitLookupApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: UnitLookupOption[];
};
