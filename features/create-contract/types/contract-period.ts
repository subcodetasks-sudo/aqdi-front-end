export type ContractPeriodOption = {
  id: number;
  period: string;
  note: string;
};

export type ContractPeriodsApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: ContractPeriodOption[];
};
