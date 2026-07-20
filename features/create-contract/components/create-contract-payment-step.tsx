"use client";

import { Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import ContractPaymentMethodFlowDialogs from "@/features/create-contract/components/contract-payment-method-flow-dialogs";
import CreateContractDiscountCodeField from "@/features/create-contract/components/create-contract-discount-code-field";
import CreateContractPaymentNavigation from "@/features/create-contract/components/create-contract-payment-navigation";
import CreateContractPaymentSummary from "@/features/create-contract/components/create-contract-payment-summary";
import CreateContractSavePropertyDialog from "@/features/create-contract/components/create-contract-save-property-dialog";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import { useApplyContractCoupon } from "@/features/create-contract/hooks/use-apply-contract-coupon";
import { useContractPaymentMethodFlow } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import { useCreateContractPaymentStep } from "@/features/create-contract/hooks/use-create-contract-payment-step";
import { useSaveProperty } from "@/features/create-contract/hooks/use-save-property";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

type CreateContractPaymentStepProps = {
  labels: CreateContractLabels["payment"];
  contractType: ContractTypeId;
  onBack: () => void;
};

export default function CreateContractPaymentStep({
  labels,
  contractType,
  onBack,
}: CreateContractPaymentStepProps) {
  const tFooter = useTranslations("footer");
  const { paymentData, setPaymentData } = useCreateContractPaymentStep();
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep1Data = useCreateContractDraftStore(
    (state) => state.contractStep1Data,
  );
  const contractUuid =
    contractSession?.uuid ?? contractStep1Data?.uuid ?? null;
  const { appliedCoupon, isApplying, applyCoupon, clearCouponDraft } =
    useApplyContractCoupon(contractUuid);
  const { submitSaveProperty, isSaving } = useSaveProperty();
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);

  const paymentFlow = useContractPaymentMethodFlow(
    contractSession?.contractId,
    contractSession?.uuid,
    {
      methodDialog: labels.methodDialog,
      draftSuccessDialog: labels.draftSuccessDialog,
      payError: labels.navigation.payError,
    },
  );

  function handleSwitchChange(checked: boolean) {
    if (checked) {
      setIsPropertyDialogOpen(true);
      return;
    }

    setPaymentData({
      ...paymentData,
      savePropertyData: false,
      propertyName: "",
    });
  }

  function handlePropertyDialogOpenChange(open: boolean) {
    setIsPropertyDialogOpen(open);
  }

  async function handleSaveProperty(propertyName: string) {
    const result = await submitSaveProperty(propertyName, {
      missingContractSession: labels.savePropertyData.dialog.missingContractSession,
      submitError: labels.savePropertyData.dialog.submitError,
      submitSuccess: labels.savePropertyData.dialog.submitSuccess,
    });

    if (!result.ok) {
      return;
    }

    setPaymentData({
      ...paymentData,
      savePropertyData: true,
      propertyName: result.propertyName,
    });
    setIsPropertyDialogOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <CreateContractStepPhaseHeader
          title={labels.title}
          subtitle={labels.subtitle}
          icon="payment"
        />

        <div className="space-y-5">
          <CreateContractPaymentSummary
            labels={labels.summary}
            contractType={contractType}
            appliedCoupon={appliedCoupon}
          />

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-brand-background px-4 py-4">
            <label className="flex w-full cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-semibold leading-relaxed text-brand">
                {labels.savePropertyData.label}
              </span>
              <Switch
                dir="ltr"
                checked={paymentData.savePropertyData}
                onCheckedChange={handleSwitchChange}
                disabled={isSaving || paymentData.savePropertyData}
                className="h-6 w-11 shrink-0 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9] disabled:cursor-not-allowed disabled:opacity-100"
              />
            </label>
          </div>

          <CreateContractDiscountCodeField
            labels={labels.discountCode}
            appliedCoupon={appliedCoupon}
            isApplying={isApplying}
            onApply={applyCoupon}
            onClear={clearCouponDraft}
          />

          <div className="flex items-start gap-2">
            <Info
              className="mt-0.5 size-4 shrink-0 text-[#bdbdbd]"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-[#7f7f7f]">
              {labels.disclaimer.prefix}{" "}
              <Link
                href={labels.disclaimer.termsHref}
                className="font-semibold text-brand-secondary underline underline-offset-2"
              >
                {labels.disclaimer.termsLink}
              </Link>{" "}
              {labels.disclaimer.and}{" "}
              <Link
                href={labels.disclaimer.privacyHref}
                className="font-semibold text-brand-secondary underline underline-offset-2"
              >
                {labels.disclaimer.privacyLink}
              </Link>
              .
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <Image
              src="/images/payments.png"
              alt={tFooter("paymentsAlt")}
              width={280}
              height={40}
              className="h-auto w-full max-w-[280px] object-contain"
            />
          </div>
        </div>
      </div>

      <CreateContractSavePropertyDialog
        labels={labels.savePropertyData.dialog}
        open={isPropertyDialogOpen}
        onOpenChange={handlePropertyDialogOpenChange}
        initialValue={paymentData.propertyName}
        isSaving={isSaving}
        onSave={handleSaveProperty}
      />

      <ContractPaymentMethodFlowDialogs
        labels={{
          methodDialog: labels.methodDialog,
          draftSuccessDialog: labels.draftSuccessDialog,
          payError: labels.navigation.payError,
        }}
        isMethodDialogOpen={paymentFlow.isMethodDialogOpen}
        onMethodDialogOpenChange={paymentFlow.setIsMethodDialogOpen}
        isDraftSuccessDialogOpen={paymentFlow.isDraftSuccessDialogOpen}
        onDraftSuccessDialogOpenChange={paymentFlow.setIsDraftSuccessDialogOpen}
        draftOrderUuid={paymentFlow.draftOrderUuid}
        isSubmitting={paymentFlow.isSubmitting}
        onSelect={paymentFlow.handlePaymentMethodSelect}
      />

      <CreateContractPaymentNavigation
        previousLabel={labels.navigation.previous}
        payLabel={labels.navigation.pay}
        payingLabel={labels.navigation.paying}
        isPaying={paymentFlow.isSubmitting}
        onPrevious={onBack}
        onPay={paymentFlow.openMethodDialog}
      />
    </div>
  );
}
