export type ContractCouponApiData = {
  type_coupon: string;
  value_coupon: number;
  discount: number;
  total_price_before_coupon: number;
  total_price_after_coupon: number;
};

export type ContractCouponApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data?: ContractCouponApiData;
};

export type AppliedContractCoupon = {
  code: string;
  message: string;
  typeCoupon: string;
  valueCoupon: number;
  discount: number;
  totalPriceBeforeCoupon: number;
  totalPriceAfterCoupon: number;
};

export function mapContractCouponApiData(
  code: string,
  message: string,
  data: ContractCouponApiData,
): AppliedContractCoupon {
  return {
    code,
    message,
    typeCoupon: data.type_coupon,
    valueCoupon: data.value_coupon,
    discount: data.discount,
    totalPriceBeforeCoupon: data.total_price_before_coupon,
    totalPriceAfterCoupon: data.total_price_after_coupon,
  };
}
