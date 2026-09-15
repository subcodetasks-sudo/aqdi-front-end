export type PaymentTypeOption = {
  id: number;
  name: string;
  notes?: string | null;
};

export type PaymentTypesApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: PaymentTypeOption[];
};
