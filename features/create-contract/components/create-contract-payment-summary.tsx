"use client";

import Image from "next/image";

import { useContractFinancial } from "@/features/create-contract/hooks/use-contract-financial";
import { useCreateContractDraftStore } from "@/features/create-contract/stores/use-create-contract-draft-store";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import {
  PAYMENT_BREAKDOWN,
  formatPaymentAmount,
} from "@/features/create-contract/types/payment-step";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type CreateContractPaymentSummaryProps = {
  labels: CreateContractLabels["payment"]["summary"];
  contractType: ContractTypeId;
};

type PaymentAmountProps = {
  amount: number;
  className?: string;
  iconClassName?: string;
  iconSize?: number;
};

function PaymentAmount({
  amount,
  className,
  iconClassName,
  iconSize = 18,
}: PaymentAmountProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-gray-400", className)}>
      <span >{formatPaymentAmount(amount)}</span>
      <CustomIcon
        src="/icons/ryal.svg"
        size={iconSize}
        className={cn("shrink-0 text-gray-400", iconClassName)}
      />
    </span>
  );
}

type SummaryRowProps = {
  label: string;
  amount: number;
  icon?: React.ReactNode;
};

function SummaryRow({ label, amount, icon }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#666666]">{label}</span>
        {icon}
      </div>
      <PaymentAmount
        amount={amount}
        className="text-sm font-semibold "
      />
    </div>
  );
}

function SummarySkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="h-4 w-32 animate-pulse rounded bg-[#e2e2e2]" />
      <span className="h-4 w-16 animate-pulse rounded bg-[#e2e2e2]" />
    </div>
  );
}

export default function CreateContractPaymentSummary({
  labels,
  contractType,
}: CreateContractPaymentSummaryProps) {
  const contractKey = useCreateContractDraftStore(
    (state) =>
      state.contractSession?.uuid ??
      state.contractStep1Data?.uuid ??
      state.contractSession?.contractId ??
      state.contractStep1Data?.contract_id ??
      null,
  );
  const { data: financial, isLoading } = useContractFinancial(contractKey);

  const breakdown = PAYMENT_BREAKDOWN[contractType];
  const docFeeLines = Array.isArray(financial?.doc_fee_lines)
    ? financial.doc_fee_lines.filter((line) => line.trim() !== "")
    : [];
  const docFeeAmount =
    typeof financial?.doc_fee === "number" ? financial.doc_fee : null;
  const isCustomDuration = financial?.duration_preset === "other";

  if (isLoading) {
    return (
      <div className="space-y-5 rounded-2xl bg-brand-background px-4 py-5">
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <div className="border-t border-dashed border-[#d4d4d4] pt-3">
          <SummarySkeletonRow />
        </div>
      </div>
    );
  }

  if (financial) {
    return (
      <div className="space-y-5 rounded-2xl bg-brand-background px-4 py-5">
        <SummaryRow
          label={labels.contractPeriodPrice}
          amount={financial.price_details.contract_period_price}
        />

        <SummaryRow
          label={labels.applicationFees}
          amount={financial.price_details.application_fees}
        />

        <SummaryRow label={labels.vat} amount={financial.price_details.tax} />

        {isCustomDuration && docFeeAmount !== null ? (
          <SummaryRow label={labels.docFee} amount={docFeeAmount} />
        ) : null}

        {isCustomDuration && docFeeLines.length > 0 ? (
          <div className="rounded-xl border border-[#d9eadf] bg-[#f3faf5] px-4 py-3 text-sm leading-7 text-[#333333]">
            {docFeeLines.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>
        ) : null}

        {financial.services.length > 0 ? (
          <div className="space-y-3 border-t border-dashed border-[#d4d4d4] pt-3">
            <span className="text-sm font-bold text-[#333333]">
              {labels.services}
            </span>
            {financial.services.map((service, index) => (
              <SummaryRow
                key={`${service.service_name}-${index}`}
                label={service.service_name}
                amount={Number(service.service_price) || 0}
              />
            ))}
          </div>
        ) : null}

        <div className="border-t border-dashed border-[#d4d4d4] pt-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-extrabold text-[#333333]">
              {labels.total}
            </span>
            <PaymentAmount
              amount={financial.total_price}
              className="text-xl font-extrabold text-brand!"
              iconClassName="text-brand"
              iconSize={22}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl bg-brand-background px-4 py-5">
      <SummaryRow
        label={labels.ejarFees}
        amount={breakdown.ejarFees}
        icon={
          <Image
            src="/images/ejar.png"
            alt={labels.ejarLogoAlt}
            width={48}
            height={18}
            className="h-4 w-auto shrink-0 object-contain"
          />
        }
      />

      <SummaryRow
        label={labels.contractPeriodPrice}
        amount={breakdown.contractPeriodPrice}
      />

      <SummaryRow label={labels.vat} amount={breakdown.vat} />

      <SummaryRow
        label={labels.applicationFees}
        amount={breakdown.applicationFees}
      />

      <div className="border-t border-dashed border-[#d4d4d4] pt-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-base font-extrabold text-[#333333]">
            {labels.total}
          </span>
          <PaymentAmount
            amount={breakdown.total}
            className="text-xl font-extrabold text-brand!"
            iconClassName="text-brand"
            iconSize={22}
          />
        </div>
      </div>
    </div>
  );
}
