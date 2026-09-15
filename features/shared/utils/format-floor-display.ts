/**
 * API ground floor is often `0` or `-1`. Show the localized ground label
 * for any numeric floor below 1; otherwise return the numeric string.
 */
export function formatFloorDisplay(
  value: string | number | null | undefined,
  groundFloorLabel: string,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  if (
    text === "" ||
    text === "-" ||
    text === "–" ||
    text === "—" ||
    text === "null" ||
    text === "undefined"
  ) {
    return null;
  }

  if (text === "ground") {
    return groundFloorLabel;
  }

  const numeric = Number(text);
  if (Number.isFinite(numeric) && numeric < 1) {
    return groundFloorLabel;
  }

  return text;
}

/** Map API floor to the unit form select value (`ground` | `"1"` | …). */
export function toFloorFormValue(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const text = String(value).trim();
  if (text === "ground") {
    return "ground";
  }

  const numeric = Number(text);
  if (Number.isFinite(numeric) && numeric < 1) {
    return "ground";
  }

  return text;
}
