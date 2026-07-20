"use server";

import {
  mapContractCouponApiData,
  type AppliedContractCoupon,
  type ContractCouponApiResponse,
} from "@/features/create-contract/types/contract-coupon";
import { apiRequest } from "@/lib/api/api-request";

export async function applyContractCoupon(
  contractUuid: string,
  codeCoupon: string,
): Promise<
  | { ok: true; coupon: AppliedContractCoupon; message: string }
  | { ok: false; error: string }
> {
  const response = await apiRequest<ContractCouponApiResponse>(
    `/Coupon/${contractUuid}`,
    {
      method: "POST",
      body: JSON.stringify({ code_coupon: codeCoupon }),
      cache: "no-store",
    },
  );

  if (!response.ok || !response.data?.success || !response.data.data) {
    return {
      ok: false,
      error: response.error || response.data?.message || "Failed to apply coupon",
    };
  }

  return {
    ok: true,
    coupon: mapContractCouponApiData(
      codeCoupon,
      response.data.message,
      response.data.data,
    ),
    message: response.data.message,
  };
}
