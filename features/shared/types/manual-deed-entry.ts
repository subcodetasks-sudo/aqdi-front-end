export type InstrumentHistoryCalendarType = "hijri" | "gregorian";

export type ManualDeedEntryData = {
  instrumentNumber: string;
  typeInstrumentHistory: InstrumentHistoryCalendarType;
  instrumentHistoryDay: string;
  instrumentHistoryMonth: string;
  instrumentHistoryYear: string;
};

export const INSTRUMENT_NUMBER_LENGTH = 12;

export const EMPTY_MANUAL_DEED_ENTRY: ManualDeedEntryData = {
  instrumentNumber: "",
  typeInstrumentHistory: "hijri",
  instrumentHistoryDay: "",
  instrumentHistoryMonth: "",
  instrumentHistoryYear: "",
};

export function normalizeInstrumentNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, INSTRUMENT_NUMBER_LENGTH);
}

function formatInstrumentHistoryPart(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  return String(Number(digits));
}

export function isManualDeedEntryComplete(value: ManualDeedEntryData) {
  const day = formatInstrumentHistoryPart(value.instrumentHistoryDay);
  const month = formatInstrumentHistoryPart(value.instrumentHistoryMonth);
  const year = value.instrumentHistoryYear.replace(/\D/g, "");

  return (
    value.instrumentNumber.length === INSTRUMENT_NUMBER_LENGTH &&
    day !== "" &&
    month !== "" &&
    year !== ""
  );
}

export function appendManualDeedEntryFields(
  formData: FormData,
  value: ManualDeedEntryData,
) {
  formData.append("instrument_number", value.instrumentNumber);
  formData.append("type_instrument_history", value.typeInstrumentHistory);
  formData.append(
    "instrument_history_day",
    formatInstrumentHistoryPart(value.instrumentHistoryDay),
  );
  formData.append(
    "instrument_history_month",
    formatInstrumentHistoryPart(value.instrumentHistoryMonth),
  );
  formData.append(
    "instrument_history_year",
    value.instrumentHistoryYear.replace(/\D/g, ""),
  );
}
