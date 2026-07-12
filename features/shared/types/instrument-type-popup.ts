export type InstrumentTypePopupContext = "contract" | "realestate";

export type InstrumentTypePopupItem = {
  id: number;
  instrument_type: string;
  popup_status_contract: boolean | 0 | 1;
  popup_status_realestate: boolean | 0 | 1;
  content_popup: string;
  button_text: string | null;
  button_link: string | null;
};

export type InstrumentTypePopupApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: InstrumentTypePopupItem[];
};
