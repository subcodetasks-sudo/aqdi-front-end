"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import type { ContractFinancialData } from "@/features/create-contract/types/contract-financial";
import type { AppliedContractCoupon } from "@/features/create-contract/types/contract-coupon";
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
  appliedCoupon?: AppliedContractCoupon | null;
  sectionTitle?: string;
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
  icon?: ReactNode;
};

function hasDisplayAmount(amount: number | null | undefined): amount is number {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

function SummaryRow({ label, amount, icon }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-sm font-medium text-[#555555]">{label}</span>
        {icon}
      </div>
      <PaymentAmount amount={amount} className="text-sm font-bold text-[#333333]" />
    </div>
  );
}

function BreakdownShell({
  sectionTitle,
  children,
}: {
  sectionTitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {sectionTitle ? (
        <p className="text-base font-extrabold text-brand">{sectionTitle}</p>
      ) : null}
      <div className="space-y-1 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3">
        {children}
      </div>
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
  appliedCoupon = null,
  sectionTitle,
}: CreateContractFinancialBreakdownProps) {
  const locale = useLocale();
  const breakdown = PAYMENT_BREAKDOWN[contractType];

  if (isLoading) {
    return (
      <BreakdownShell sectionTitle={sectionTitle}>
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <div className="border-t border-dashed border-[#d4d4d4] pt-3">
          <SummarySkeletonRow />
        </div>
      </BreakdownShell>
    );
  }

  if (data) {
    const services =
      (data.additional_services?.length ?? 0) > 0
        ? data.additional_services
        : (data.services ?? []);
    const docFeeLines = Array.isArray(data.doc_fee_lines)
      ? data.doc_fee_lines.filter((line) => line.trim() !== "")
      : [];
    const docFeeAmount =
      typeof data.doc_fee === "number" ? data.doc_fee : null;
    const isCustomDuration = data.duration_preset === "other";
    const visibleServices = services.filter((service) =>
      hasDisplayAmount(getContractFinancialServicePrice(service)),
    );

    return (
      <BreakdownShell sectionTitle={sectionTitle}>
        {hasDisplayAmount(data.price_details.contract_period_price) ? (
          <SummaryRow
            label={labels.contractPeriodPrice}
            amount={data.price_details.contract_period_price}
          />
        ) : null}

        {hasDisplayAmount(data.price_details.application_fees) ? (
          <SummaryRow
            label={labels.applicationFees}
            amount={data.price_details.application_fees}
          />
        ) : null}

        {hasDisplayAmount(data.price_details.tax) ? (
          <SummaryRow label={labels.vat} amount={data.price_details.tax} />
        ) : null}

        {hasDisplayAmount(data.price_details.electricity_meter_fee) ? (
          <SummaryRow
            label={labels.electricityMeterFee}
            amount={data.price_details.electricity_meter_fee}
          />
        ) : null}

        {hasDisplayAmount(data.price_details.water_meter_fee) ? (
          <SummaryRow
            label={labels.waterMeterFee}
            amount={data.price_details.water_meter_fee}
          />
        ) : null}

        {isCustomDuration && hasDisplayAmount(docFeeAmount) ? (
          <SummaryRow label={labels.docFee} amount={docFeeAmount} />
        ) : null}

        {isCustomDuration && docFeeLines.length > 0 ? (
          <div className="rounded-xl border border-[#d9eadf] bg-[#f3faf5] px-4 py-3 text-sm leading-7 text-[#333333]">
            {docFeeLines.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>
        ) : null}

        {visibleServices.length > 0 ? (
          <div className="space-y-1 border-t border-dashed border-[#d4d4d4] pt-2">
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-sm font-bold text-[#333333]">
                {labels.services}
              </span>
              {hasDisplayAmount(data.services_total) ? (
                <PaymentAmount
                  amount={data.services_total}
                  className="text-sm font-bold text-[#333333]"
                />
              ) : null}
            </div>
            {visibleServices.map((service, index) => (
              <SummaryRow
                key={service.id ?? `${service.service_name}-${index}`}
                label={getContractFinancialServiceLabel(service, locale)}
                amount={getContractFinancialServicePrice(service)}
              />
            ))}
          </div>
        ) : hasDisplayAmount(data.services_total) ? (
          <SummaryRow
            label={labels.servicesTotal}
            amount={data.services_total}
          />
        ) : null}

        {appliedCoupon ? (
          <div className="space-y-0 border-t border-dashed border-[#d4d4d4] pt-2">
            {hasDisplayAmount(appliedCoupon.totalPriceBeforeCoupon) ? (
              <SummaryRow
                label={labels.priceBeforeCoupon}
                amount={appliedCoupon.totalPriceBeforeCoupon}
              />
            ) : null}
            {hasDisplayAmount(appliedCoupon.discount) ? (
              <SummaryRow
                label={labels.discount}
                amount={appliedCoupon.discount}
              />
            ) : null}
          </div>
        ) : null}

        <div className="border-t border-dashed border-[#d4d4d4] pt-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-extrabold text-[#333333]">
              {appliedCoupon ? labels.priceAfterCoupon : labels.total}
            </span>
            <PaymentAmount
              amount={
                appliedCoupon
                  ? appliedCoupon.totalPriceAfterCoupon
                  : data.total_price
              }
              className="text-xl font-extrabold text-brand!"
              iconClassName="text-brand"
              iconSize={22}
            />
          </div>
        </div>
      </BreakdownShell>
    );
  }

  return (
    <BreakdownShell sectionTitle={sectionTitle}>
      {hasDisplayAmount(breakdown.ejarFees) ? (
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
      ) : null}

      {hasDisplayAmount(breakdown.contractPeriodPrice) ? (
        <SummaryRow
          label={labels.contractPeriodPrice}
          amount={breakdown.contractPeriodPrice}
        />
      ) : null}

      {hasDisplayAmount(breakdown.vat) ? (
        <SummaryRow label={labels.vat} amount={breakdown.vat} />
      ) : null}

      {hasDisplayAmount(breakdown.applicationFees) ? (
        <SummaryRow
          label={labels.applicationFees}
          amount={breakdown.applicationFees}
        />
      ) : null}

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
    </BreakdownShell>
  );
}
