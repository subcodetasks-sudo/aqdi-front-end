export type WebsiteStatusData = {
  is_open: boolean;
  message: string | null;
  message_ar: string | null;
  message_en: string | null;
};

export type WebsiteStatusApiResponse = {
  success: boolean;
  code: number;
  message?: string | null;
  data: WebsiteStatusData;
};

/** Normalised shape consumed by the app (boot check + maintenance page). */
export type WebsiteStatus = {
  isOpen: boolean;
  messageAr: string | null;
  messageEn: string | null;
};
