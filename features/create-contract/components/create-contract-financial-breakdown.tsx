"use client";

import Image from "next/image";
import { useLocale } from "next-intl";

import type { ContractFinancialData } from "@/features/create-contract/types/contract-financial";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import type { ContractTypeId } from "@/features/create-contract/types/contract-type";
import {
  PAYMENT_BREAKDOWN,
  formatPaymentAmount,
} from "@/features/create-contract/types/payment-step";
import {
  getContractFinancialServiceLabel,
  getContractFinancialServicePrice,
} from "@/features/create-contract/utils/contract-financial-display";
import CustomIcon from "@/features/shared/components/custom-icon";
import { cn } from "@/lib/utils";

type FinancialSummaryLabels = CreateContractLabels["payment"]["summary"];

type CreateContractFinancialBreakdownProps = {
  labels: FinancialSummaryLabels;
  contractType: ContractTypeId;
  data: ContractFinancialData | undefined;
  isLoading: boolean;
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
      <span>{formatPaymentAmount(amount)}</span>
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
      <PaymentAmount amount={amount} className="text-sm font-semibold " />
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

export default function CreateContractFinancialBreakdown({
  labels,
  contractType,
  data,
  isLoading,
}: CreateContractFinancialBreakdownProps) {
  const locale = useLocale();
  const breakdown = PAYMENT_BREAKDOWN[contractType];

  if (isLoading) {
    return (
      <div className="space-y-5 rounded-2xl bg-brand-background px-4 py-5">
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <div className="border-t border-dashed border-[#d4d4d4] pt-3">
          <SummarySkeletonRow />
        </div>
      </div>
    );
  }

  if (data) {
    const services =
      data.additional_services.length > 0
        ? data.additional_services
        : data.services;

    return (
      <div className="space-y-5 rounded-2xl bg-brand-background px-4 py-5">
        <SummaryRow
          label={labels.contractPeriodPrice}
          amount={data.price_details.contract_period_price}
        />

        <SummaryRow
          label={labels.applicationFees}
          amount={data.price_details.application_fees}
        />

        <SummaryRow label={labels.vat} amount={data.price_details.tax} />

        <SummaryRow
          label={labels.electricityMeterFee}
          amount={data.price_details.electricity_meter_fee}
        />

        <SummaryRow
          label={labels.waterMeterFee}
          amount={data.price_details.water_meter_fee}
        />

        {services.length > 0 ? (
          <div className="space-y-3 border-t border-dashed border-[#d4d4d4] pt-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-[#333333]">
                {labels.services}
              </span>
              <PaymentAmount
                amount={data.services_total}
                className="text-sm font-bold text-[#333333]"
              />
            </div>
            {services.map((service) => (
              <SummaryRow
                key={service.id}
                label={getContractFinancialServiceLabel(service, locale)}
                amount={getContractFinancialServicePrice(service)}
              />
            ))}
          </div>
        ) : data.services_total > 0 ? (
          <SummaryRow
            label={labels.servicesTotal}
            amount={data.services_total}
          />
        ) : null}

        <div className="border-t border-dashed border-[#d4d4d4] pt-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-extrabold text-[#333333]">
              {labels.total}
            </span>
            <PaymentAmount
              amount={data.total_price}
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
