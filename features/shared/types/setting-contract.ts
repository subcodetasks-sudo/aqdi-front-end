export type SettingContractItem = {
  id: number;
  instrument_type: string;
  realestate: boolean;
  contract: boolean;
  label: string;
};

export type SettingContractsApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: SettingContractItem[];
};
