"use client";

import type { ReactNode } from "react";

import type {
  ContractFinancialData,
  ContractFinancialLine,
} from "@/features/create-contract/types/contract-financial";
import { getContractFinancialPayable } from "@/features/create-contract/types/contract-financial";
import type { AppliedContractCoupon } from "@/features/create-contract/types/contract-coupon";
import type { CreateContractLabels } from "@/features/create-contract/types/create-contract-labels";
import { formatContractMoney } from "@/features/create-contract/utils/format-contract-money";
import {
  formatFinancialLineLabel,
  getContractFinancialDisplayLines,
} from "@/features/create-contract/utils/parse-contract-financial";
import { cn } from "@/lib/utils";

type FinancialSummaryLabels = CreateContractLabels["payment"]["summary"];

type CreateContractFinancialBreakdownProps = {
  labels: FinancialSummaryLabels;
  data: ContractFinancialData | undefined;
  isLoading: boolean;
  appliedCoupon?: AppliedContractCoupon | null;
  sectionTitle?: string;
  /** Paper ownership deed (صك ملكية ورقي) includes `paper_deed_fee`, even at 0. */
  showPaperDeedFee?: boolean;
};

type SummaryRowProps = {
  label: string;
  amount: number;
  currency: string;
  primary?: boolean;
};

function hasDisplayAmount(amount: number | null | undefined): amount is number {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

/** Fee rows the API omits from `details[]` when their amount is 0 — always shown here. */
function getAlwaysVisibleFeeLines(
  data: ContractFinancialData,
  labels: FinancialSummaryLabels,
  presentKeys: Set<string>,
  showPaperDeedFee: boolean,
): ContractFinancialLine[] {
  const rows: Array<{ key: string; label: string; amount: number | null | undefined }> = [
    {
      key: "application_fees",
      label: labels.applicationFees,
      amount: data.application_fees ?? data.price_details?.application_fees,
    },
    {
      key: "tax",
      label: labels.vat,
      amount: data.tax_amount ?? data.price_details?.tax,
    },
    {
      key: "electricity_meter_fee",
      label: labels.electricityMeterFee,
      amount: data.electricity_meter_fee ?? data.price_details?.electricity_meter_fee,
    },
    {
      key: "water_meter_fee",
      label: labels.waterMeterFee,
      amount: data.water_meter_fee ?? data.price_details?.water_meter_fee,
    },
  ];

  if (showPaperDeedFee) {
    rows.push({
      key: "paper_deed_fee",
      label: labels.paperDeedFee,
      amount: data.paper_deed_fee ?? data.price_details?.paper_deed_fee,
    });
  }

  return rows
    .filter((row) => !presentKeys.has(row.key))
    .map((row) => ({
      key: row.key,
      label: row.label,
      amount:
        typeof row.amount === "number" && Number.isFinite(row.amount)
          ? row.amount
          : 0,
      percent: null,
    }));
}

function SummaryRow({
  label,
  amount,
  currency,
  primary = false,
}: SummaryRowProps) {
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between gap-4">
        <span
          className={cn(
            "min-w-0 text-sm",
            primary
              ? "font-bold text-[#222222] dark:text-[#e8f0ee]"
              : "font-medium text-[#555555] dark:text-[#9eb5af]",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "shrink-0 text-sm font-bold tabular-nums",
            primary ? "text-brand" : "text-[#333333] dark:text-[#e8f0ee]",
          )}
        >
          {formatContractMoney(amount, currency)}
        </span>
      </div>
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
      <div className="space-y-1 rounded-2xl border border-[#e8e8e8] bg-[#ffffff] px-4 py-3 dark:bg-[#141b19]">
        {children}
      </div>
    </div>
  );
}

function SummarySkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="h-4 w-32 animate-pulse rounded bg-[#e2e2e2] dark:bg-[#243430]" />
      <span className="h-4 w-16 animate-pulse rounded bg-[#e2e2e2] dark:bg-[#243430]" />
    </div>
  );
}

function TotalRow({
  label,
  amount,
  currency,
}: {
  label: string;
  amount: number;
  currency: string;
}) {
  return (
    <div className="border-t border-[#1a5c4a] pt-3 dark:border-[#7dccc0]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-extrabold text-brand dark:text-[#7dccc0]">
          {label}
        </span>
        <span className="text-xl font-extrabold tabular-nums text-brand dark:text-[#7dccc0]">
          {formatContractMoney(amount, currency)}
        </span>
      </div>
    </div>
  );
}

export default function CreateContractFinancialBreakdown({
  labels,
  data,
  isLoading,
  appliedCoupon = null,
  sectionTitle,
  showPaperDeedFee = false,
}: CreateContractFinancialBreakdownProps) {
  if (isLoading) {
    return (
      <BreakdownShell sectionTitle={sectionTitle}>
        <SummarySkeletonRow />
        <SummarySkeletonRow />
        <div className="border-t border-[#1a5c4a] pt-3 dark:border-[#7dccc0]">
          <SummarySkeletonRow />
        </div>
      </BreakdownShell>
    );
  }

  if (!data) {
    return null;
  }

  const apiLines = getContractFinancialDisplayLines(data);
  const presentKeys = new Set(apiLines.map((line) => line.key));
  const lines = [
    ...apiLines,
    ...getAlwaysVisibleFeeLines(data, labels, presentKeys, showPaperDeedFee),
  ];
  const currency = labels.currency;
  const apiCoupon = hasDisplayAmount(data.coupon) ? data.coupon : null;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discount
    : apiCoupon;
  const hasCoupon = hasDisplayAmount(couponDiscount);

  const totalBeforeCoupon = appliedCoupon
    ? appliedCoupon.totalPriceBeforeCoupon
    : data.total_price;

  const payable = appliedCoupon
    ? appliedCoupon.totalPriceAfterCoupon
    : getContractFinancialPayable(data);

  return (
    <BreakdownShell sectionTitle={sectionTitle}>
      {lines.map((line, index) => (
        <SummaryRow
          key={`${line.key}-${index}`}
          label={formatFinancialLineLabel(line, labels.taxWithPercent)}
          amount={line.amount}
          currency={currency}
        />
      ))}

      {hasCoupon ? (
        <>
          <div className="border-t border-dashed border-[#d4d4d4] dark:border-[#2f403b]" />
          <SummaryRow
            label={labels.total}
            amount={totalBeforeCoupon}
            currency={currency}
          />
          <SummaryRow
            label={labels.couponDiscount}
            amount={couponDiscount}
            currency={currency}
          />
          <TotalRow
            label={labels.payable}
            amount={payable}
            currency={currency}
          />
        </>
      ) : (
        <TotalRow
          label={labels.total}
          amount={payable}
          currency={currency}
        />
      )}
    </BreakdownShell>
  );
}
