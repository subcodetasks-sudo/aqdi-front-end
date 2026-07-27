"use client";

import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import ContractPaymentMethodFlowDialogs from "@/features/create-contract/components/contract-payment-method-flow-dialogs";
import CreateContractDiscountCodeField from "@/features/create-contract/components/create-contract-discount-code-field";
import CreateContractPaymentHero from "@/features/create-contract/components/create-contract-payment-hero";
import CreateContractPaymentNavigation from "@/features/create-contract/components/create-contract-payment-navigation";
import CreateContractPaymentSummary from "@/features/create-contract/components/create-contract-payment-summary";
import CreateContractReviewOrderDialog from "@/features/create-contract/components/create-contract-review-order-dialog";
import CreateContractSaveLaterDialog from "@/features/create-contract/components/create-contract-save-later-dialog";
import CreateContractSavePropertyDialog from "@/features/create-contract/components/create-contract-save-property-dialog";
import { useApplyContractCoupon } from "@/features/create-contract/hooks/use-apply-contract-coupon";
import { useContractFinanceSummary } from "@/features/create-contract/hooks/use-contract-finance-summary";
import { useContractPaymentMethodFlow } from "@/features/create-contract/hooks/use-contract-payment-method-flow";
import { useCreateContractPaymentStep } from "@/features/create-contract/hooks/use-create-contract-payment-step";
import { useSaveContractDraft } from "@/features/create-contract/hooks/use-save-contract-draft";
import { useSaveProperty } from "@/features/create-contract/hooks/use-save-property";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import type { CreateContractStep } from "@/features/create-contract/types/create-contract-step";
import type { DeedTypeId } from "@/features/create-contract/types/deed-type";
import {
  formatPaymentAmount,
  PAYMENT_BREAKDOWN,
} from "@/features/create-contract/types/payment-step";
import { resetCreateContractDraft } from "@/features/create-contract/utils/reset-create-contract-draft";

type CreateContractPaymentStepProps = {
  labels: CreateContractLabels["payment"];
  saveLaterDialogLabels: CreateContractLabels["tenant"]["saveLaterDialog"];
  deedTypeLabels: Record<DeedTypeId, string>;
  deedAttachmentLabels: {
    label: string;
    salePaperLabel?: string;
  };
  contractType: ContractTypeId;
  onBack: () => void;
  onEditStep: (step: CreateContractStep) => void;
};

function withTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export default function CreateContractPaymentStep({
  labels,
  saveLaterDialogLabels,
  deedTypeLabels,
  deedAttachmentLabels,
  contractType,
  onBack,
  onEditStep,
}: CreateContractPaymentStepProps) {
  const tFooter = useTranslations("footer");
  const router = useRouter();
  const { paymentData, setPaymentData } = useCreateContractPaymentStep();
  const contractSession = useCreateContractDraftStore((state) => state.contractSession);
  const contractStep1Data = useCreateContractDraftStore(
    (state) => state.contractStep1Data,
  );
  const contractUuid =
    contractSession?.uuid ?? contractStep1Data?.uuid ?? null;
  const contractId =
    contractSession?.contractId ?? contractStep1Data?.contract_id ?? null;
  const { appliedCoupon, isApplying, applyCoupon, clearCouponDraft } =
    useApplyContractCoupon(contractUuid);
  const financeSummaryQuery = useContractFinanceSummary(contractUuid);
  const { submitSaveProperty, isSaving } = useSaveProperty();
  const { saveDraft, isSaving: isSavingDraft } = useSaveContractDraft();
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [saveLaterDialogOpen, setSaveLaterDialogOpen] = useState(false);
  const [reviewOrderDialogOpen, setReviewOrderDialogOpen] = useState(false);

  const paymentFlow = useContractPaymentMethodFlow(
    contractSession?.contractId,
    contractSession?.uuid,
    {
      methodDialog: labels.methodDialog,
      draftSuccessDialog: labels.draftSuccessDialog,
      payError: labels.navigation.payError,
    },
  );

  const fallbackTotal = PAYMENT_BREAKDOWN[contractType].total;
  const payableTotal = appliedCoupon
    ? appliedCoupon.totalPriceAfterCoupon
    : (financeSummaryQuery.data?.total_price ?? fallbackTotal);
  const hasDiscount =
    Boolean(appliedCoupon) &&
    typeof appliedCoupon?.discount === "number" &&
    appliedCoupon.discount > 0;
  const discountAmount = appliedCoupon?.discount ?? 0;
  const discountPercent =
    appliedCoupon && appliedCoupon.totalPriceBeforeCoupon > 0
      ? Math.round(
          (appliedCoupon.discount / appliedCoupon.totalPriceBeforeCoupon) * 100,
        )
      : 0;

  const selectedMethod = paymentFlow.selectedPaymentMethod;
  const payLabel =
    selectedMethod === "draft"
      ? labels.navigation.sendDraft
      : selectedMethod === "pay-now"
        ? withTemplate(labels.navigation.payWithAmount, {
            amount: formatPaymentAmount(payableTotal),
          })
        : labels.navigation.pay;

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

  async function handleConfirmSaveLater() {
    if (isSavingDraft || paymentFlow.isSubmitting) {
      return;
    }

    const result = await saveDraft();

    if (!result.ok) {
      toast.error(
        result.error === "missingContractSession"
          ? labels.navigation.payError
          : result.error || labels.navigation.saveError,
      );
      return;
    }

    setSaveLaterDialogOpen(false);
    resetCreateContractDraft();
    router.push("/requests");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-5">
          <CreateContractPaymentHero
            journeyMessage={labels.journeyMessage}
            securePaymentLabel={labels.securePaymentLabel}
            reviewOrderLabel={labels.reviewOrderLabel}
            onReviewOrder={() => setReviewOrderDialogOpen(true)}
          />

          <CreateContractPaymentSummary
            labels={labels.summary}
            contractType={contractType}
            appliedCoupon={appliedCoupon}
          />

          {selectedMethod ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#cfe8dd] bg-[#f5fbf8] px-4 py-3">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-extrabold text-brand">
                  {selectedMethod === "draft"
                    ? labels.methodDialog.selected.draft.title
                    : labels.methodDialog.selected.payNow.title}
                </p>
                <p className="text-xs leading-relaxed text-[#4f6b62]">
                  {selectedMethod === "draft"
                    ? labels.methodDialog.selected.draft.description
                    : hasDiscount
                      ? withTemplate(labels.methodDialog.selected.payNow.savings, {
                          percent: discountPercent,
                          amount: formatPaymentAmount(discountAmount),
                        })
                      : labels.methodDialog.selected.payNow.description}
                </p>
              </div>
              <button
                type="button"
                onClick={paymentFlow.openMethodDialog}
                className="shrink-0 text-xs font-bold text-brand underline underline-offset-2 transition-opacity hover:opacity-70"
              >
                {labels.methodDialog.changeMethod}
              </button>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-4">
            <label className="flex w-full cursor-pointer items-center justify-between gap-3">
              <span className="flex flex-col gap-1">
                <span className="text-sm font-semibold leading-relaxed text-brand">
                  {labels.savePropertyData.label}
                </span>
                <span className="text-xs leading-relaxed text-[#7f7f7f] dark:text-[#9eb5af]">
                  {labels.savePropertyData.description}
                </span>
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

          <div className="flex justify-center">
            <Image
              src="/images/payments.png"
              alt={tFooter("paymentsAlt")}
              width={280}
              height={40}
              className="h-auto w-full max-w-70 object-contain"
            />
          </div>

          <p className="text-center text-xs leading-relaxed text-[#7f7f7f]">
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
        hasDiscount={hasDiscount}
        totalPrice={
          appliedCoupon?.totalPriceBeforeCoupon ??
          financeSummaryQuery.data?.total_price ??
          fallbackTotal
        }
        discountedPrice={
          hasDiscount ? appliedCoupon?.totalPriceAfterCoupon ?? null : null
        }
        selectedMethod={paymentFlow.selectedPaymentMethod}
        onSelect={paymentFlow.selectPaymentMethod}
      />

      <CreateContractSaveLaterDialog
        labels={saveLaterDialogLabels}
        open={saveLaterDialogOpen}
        onOpenChange={setSaveLaterDialogOpen}
        orderNumber={contractId}
        isSaving={isSavingDraft}
        onConfirm={() => void handleConfirmSaveLater()}
      />

      <CreateContractReviewOrderDialog
        open={reviewOrderDialogOpen}
        onOpenChange={setReviewOrderDialogOpen}
        labels={labels.reviewDialog}
        contractType={contractType}
        deedTypeLabels={deedTypeLabels}
        deedAttachmentLabels={deedAttachmentLabels}
        onEditStep={onEditStep}
      />

      <CreateContractPaymentNavigation
        previousLabel={labels.navigation.previous}
        payLabel={payLabel}
        payingLabel={labels.navigation.paying}
        saveLabel={labels.navigation.save}
        isPaying={paymentFlow.isSubmitting}
        isSaving={isSavingDraft}
        onPrevious={onBack}
        onPay={() => void paymentFlow.handlePrimaryAction()}
        onSave={() => setSaveLaterDialogOpen(true)}
      />

      <p className="flex items-center justify-center gap-2 text-xs text-[#9a9a9a]">
        <Lock className="size-3.5 shrink-0" aria-hidden="true" />
        <span>{labels.encryptionNote}</span>
      </p>
    </div>
  );
}
