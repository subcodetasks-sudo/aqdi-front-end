"use client";

import Image from "next/image";

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

export default function CreateContractPaymentSummary({
  labels,
  contractType,
}: CreateContractPaymentSummaryProps) {
  const breakdown = PAYMENT_BREAKDOWN[contractType];

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
