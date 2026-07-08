export type ServicePricingItem = {
  name: string;
  price: string;
};

export type ServicesPricingApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: ServicePricingItem[];
};
