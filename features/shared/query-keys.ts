export const settingContractsKeys = {
  all: ["setting-contracts"] as const,
  list: () => [...settingContractsKeys.all, "list"] as const,
};

export const meterFeeSettingsKeys = {
  all: ["meter-fee-settings"] as const,
  detail: () => [...meterFeeSettingsKeys.all, "detail"] as const,
};
