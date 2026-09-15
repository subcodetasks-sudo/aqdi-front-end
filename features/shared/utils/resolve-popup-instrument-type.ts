// The popup API may use shorter/legacy instrument_type keys than step submission.
const POPUP_INSTRUMENT_TYPE_ALIASES: Record<string, string> = {
  electronic_deed_from_the_ministry_of_justice: "electronic",
};

export function resolvePopupInstrumentType(instrumentType: string): string {
  return POPUP_INSTRUMENT_TYPE_ALIASES[instrumentType] ?? instrumentType;
}
