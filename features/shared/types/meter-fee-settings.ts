export type MeterFeeSettings = {
  electricity_meter_fee_commercial_tenant: number;
  electricity_meter_fee_housing_tenant: number;
  water_meter_fee_commercial_tenant: number;
  water_meter_fee_housing_tenant: number;
};

export type MeterFeeSettingsApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: MeterFeeSettings;
};
