export type InstrumentHistoryCalendarType = "hijri" | "gregorian";

export type ManualDeedEntryData = {
  instrumentNumber: string;
  typeInstrumentHistory: InstrumentHistoryCalendarType;
  instrumentHistoryDay: string;
  instrumentHistoryMonth: string;
  instrumentHistoryYear: string;
};

export const EMPTY_MANUAL_DEED_ENTRY: ManualDeedEntryData = {
  instrumentNumber: "",
  typeInstrumentHistory: "hijri",
  instrumentHistoryDay: "",
  instrumentHistoryMonth: "",
  instrumentHistoryYear: "",
};

export function normalizeInstrumentNumber(value: string) {
  return value.replace(/\D/g, "");
}

function formatInstrumentHistoryPart(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  return digits.padStart(2, "0");
}

export function isManualDeedEntryComplete(value: ManualDeedEntryData) {
  const day = formatInstrumentHistoryPart(value.instrumentHistoryDay);
  const month = formatInstrumentHistoryPart(value.instrumentHistoryMonth);
  const year = value.instrumentHistoryYear.replace(/\D/g, "");

  return (
    value.instrumentNumber.trim().length > 0 &&
    day !== "" &&
    month !== "" &&
    year !== ""
  );
}

export function appendManualDeedEntryFields(
  formData: FormData,
  value: ManualDeedEntryData,
) {
  const day = formatInstrumentHistoryPart(value.instrumentHistoryDay);
  const month = formatInstrumentHistoryPart(value.instrumentHistoryMonth);
  const year = value.instrumentHistoryYear.replace(/\D/g, "");

  formData.append("instrument_number", value.instrumentNumber.trim());
  formData.append("type_instrument_history", value.typeInstrumentHistory);
  formData.append("instrument_history_day", day);
  formData.append("instrument_history_month", month);
  formData.append("instrument_history_year", year);

  if (day && month && year) {
    formData.append("instrument_history", `${day}-${month}-${year}`);
  }
}
