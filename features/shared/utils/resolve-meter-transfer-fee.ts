import type { PropertyContractType } from "@/features/create-property/utils/contract-type";
import type { MeterFeeSettings } from "@/features/shared/types/meter-fee-settings";

export type MeterKind = "electricity" | "water";

export function resolveMeterTransferFee(
  settings: MeterFeeSettings | undefined,
  meterKind: MeterKind,
  contractType: PropertyContractType,
): number {
  if (!settings) {
    return 0;
  }

  if (meterKind === "electricity") {
    return contractType === "housing"
      ? settings.electricity_meter_fee_housing_tenant
      : settings.electricity_meter_fee_commercial_tenant;
  }

  return contractType === "housing"
    ? settings.water_meter_fee_housing_tenant
    : settings.water_meter_fee_commercial_tenant;
}

export function formatMeterFee(fee: number) {
  return new Intl.NumberFormat("en-US").format(fee);
}
