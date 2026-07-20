"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { contractFinanceSummaryKeys } from "@/features/create-contract/query-keys";
import { applyContractCoupon } from "@/features/create-contract/services/apply-contract-coupon";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";

export function useApplyContractCoupon(contractUuid: string | null) {
  const t = useTranslations("createContract.payment.discountCode");
  const queryClient = useQueryClient();
  const paymentData = useCreateContractDraftStore((state) => state.paymentData);
  const setPaymentData = useCreateContractDraftStore((state) => state.setPaymentData);
  const [isApplying, setIsApplying] = useState(false);

  async function applyCoupon(code: string): Promise<boolean> {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      return false;
    }

    if (paymentData.appliedCoupon) {
      toast.error(t("alreadyApplied"));
      return false;
    }

    if (!contractUuid) {
      toast.error(t("missingContractSession"));
      return false;
    }

    setIsApplying(true);

    try {
      const result = await applyContractCoupon(contractUuid, trimmedCode);

      if (!result.ok) {
        toast.error(result.error || t("applyError"));
        return false;
      }

      setPaymentData({
        ...paymentData,
        appliedCoupon: result.coupon,
      });

      await queryClient.invalidateQueries({
        queryKey: contractFinanceSummaryKeys.detail(contractUuid),
      });

      toast.success(result.message);
      return true;
    } finally {
      setIsApplying(false);
    }
  }

  function clearCouponDraft() {
    if (paymentData.appliedCoupon) {
      return;
    }

    setPaymentData({
      ...paymentData,
      appliedCoupon: null,
    });
  }

  return {
    appliedCoupon: paymentData.appliedCoupon,
    isApplying,
    applyCoupon,
    clearCouponDraft,
  };
}
