export const appSettingsKeys = {
  all: ["app-settings"] as const,
  detail: () => [...appSettingsKeys.all, "detail"] as const,
};
