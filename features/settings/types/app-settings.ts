export type AppSettingsDocument = {
  description: string;
};

export type AppSettings = {
  whatsapp: string;
  instagram: string;
  twitter: string;
  snapchat: string;
  facebook: string;
  tiktok: string;
  linkedIn: string;
  whatsapp_contact: string;
  version: string;
  time_to_documentation_contract: number;
  open_payment: number;
  is_open: number;
  working_hours: string | null;
  sms_user: string;
  sms_owner: string;
  sms_employee: string;
  electricity_meter_fee_commercial_tenant: number;
  electricity_meter_fee_housing_tenant: number;
  water_meter_fee_commercial_tenant: number;
  water_meter_fee_housing_tenant: number;
  terms: AppSettingsDocument;
  privacy: AppSettingsDocument;
  image_banner: string | null;
};

export type AppSettingsApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: AppSettings;
};
