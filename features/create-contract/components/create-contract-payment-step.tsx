"use client";

import { Info } from "lucide-react";
import Link from "next/link";

import { Switch } from "@/components/ui/switch";
import CreateContractPaymentNavigation from "@/features/create-contract/components/create-contract-payment-navigation";
import CreateContractPaymentSummary from "@/features/create-contract/components/create-contract-payment-summary";
import CreateContractStepPhaseHeader from "@/features/create-contract/components/create-contract-step-phase-header";
import { useCreateContractPaymentStep } from "@/features/create-contract/hooks/use-create-contract-payment-step";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";

type CreateContractPaymentStepProps = {
  labels: CreateContractLabels["payment"];
  contractType: ContractTypeId;
  onBack: () => void;
  onComplete: () => void;
};

export default function CreateContractPaymentStep({
  labels,
  contractType,
  onBack,
  onComplete,
}: CreateContractPaymentStepProps) {
  const { paymentData, setPaymentData } = useCreateContractPaymentStep();

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
          />

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-brand-background px-4 py-4">
            <label className="flex w-full cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-semibold leading-relaxed text-brand">
                {labels.savePropertyData.label}
              </span>
              <Switch
                dir="ltr"
                checked={paymentData.savePropertyData}
                onCheckedChange={(savePropertyData) =>
                  setPaymentData({ savePropertyData })
                }
                className="h-6 w-11 shrink-0 data-checked:bg-brand-secondary data-unchecked:bg-[#d9d9d9]"
              />
            </label>
          </div>

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
        </div>
      </div>

      <CreateContractPaymentNavigation
        previousLabel={labels.navigation.previous}
        payLabel={labels.navigation.pay}
        onPrevious={onBack}
        onPay={onComplete}
      />
    </div>
  );
}
