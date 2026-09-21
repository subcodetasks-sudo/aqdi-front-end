export type CalendarType = "hijri" | "gregorian";

export type CalendarDateParts = {
  year: number;
  month: number;
  day: number;
};

export type CalendarDateValue = {
  calendarType: CalendarType;
  day: string;
  month: string;
  year: string;
};

export type ConvertCalendarDateClamp = {
  minYear: number;
  maxYear: number;
  maxMonth?: (year: number) => number;
  maxDay?: (year: number, month: number) => number;
};

function parsePart(value: string) {
  const parsed = Number(value.replace(/\D/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function compareDateParts(left: CalendarDateParts, right: CalendarDateParts) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }

  if (left.month !== right.month) {
    return left.month - right.month;
  }

  return left.day - right.day;
}

function getGregorianParts(date: Date): CalendarDateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function getHijriParts(date: Date): CalendarDateParts | null {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);

    const year = Number(
      parts.find((part) => part.type === "year")?.value?.replace(/\D/g, ""),
    );
    const month = Number(
      parts.find((part) => part.type === "month")?.value?.replace(/\D/g, ""),
    );
    const day = Number(
      parts.find((part) => part.type === "day")?.value?.replace(/\D/g, ""),
    );

    if (
      Number.isFinite(year) &&
      year > 0 &&
      Number.isFinite(month) &&
      month > 0 &&
      Number.isFinite(day) &&
      day > 0
    ) {
      return { year, month, day };
    }
  } catch {
    // Fallback below.
  }

  return null;
}

function getDaysInGregorianMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function toGregorianDate(parts: CalendarDateParts) {
  const day = Math.min(
    parts.day,
    getDaysInGregorianMonth(parts.year, parts.month),
  );
  return new Date(parts.year, parts.month - 1, day, 12, 0, 0, 0);
}

function convertGregorianPartsToHijri(
  parts: CalendarDateParts,
): CalendarDateParts | null {
  return getHijriParts(toGregorianDate(parts));
}

/**
 * Resolve a Hijri civil date to Gregorian by binary-searching days whose
 * Umm al-Qura parts match. Falls back to nearby days when the Hijri day
 * does not exist in that month (e.g. day 30 in a 29-day month).
 */
function convertHijriPartsToGregorian(
  parts: CalendarDateParts,
): CalendarDateParts | null {
  const candidates = [parts.day, parts.day - 1, parts.day - 2].filter(
    (day) => day > 0,
  );

  for (const day of candidates) {
    const target = { ...parts, day };
    const estimateYear = target.year + 579;
    let low = Math.floor(Date.UTC(estimateYear - 3, 0, 1) / 86_400_000);
    let high = Math.floor(Date.UTC(estimateYear + 3, 11, 31) / 86_400_000);

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const utc = new Date(mid * 86_400_000);
      const local = new Date(
        utc.getUTCFullYear(),
        utc.getUTCMonth(),
        utc.getUTCDate(),
        12,
        0,
        0,
        0,
      );
      const hijri = getHijriParts(local);

      if (!hijri) {
        break;
      }

      const comparison = compareDateParts(hijri, target);

      if (comparison === 0) {
        return getGregorianParts(local);
      }

      if (comparison < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return null;
}

export function convertCalendarDateParts(
  parts: CalendarDateParts,
  from: CalendarType,
  to: CalendarType,
): CalendarDateParts | null {
  if (from === to) {
    return parts;
  }

  if (from === "gregorian" && to === "hijri") {
    return convertGregorianPartsToHijri(parts);
  }

  return convertHijriPartsToGregorian(parts);
}

export function padCalendarDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function defaultMaxDay(calendarType: CalendarType) {
  return calendarType === "hijri" ? 30 : 31;
}

function clampConvertedDate(
  calendarType: CalendarType,
  parts: CalendarDateParts,
  preserveMonth: boolean,
  preserveDay: boolean,
  clamp?: ConvertCalendarDateClamp,
): CalendarDateValue {
  let year = parts.year;
  if (clamp) {
    year = Math.min(clamp.maxYear, Math.max(clamp.minYear, year));
  }

  const yearValue = String(year);
  let month = preserveMonth ? parts.month : 0;
  if (preserveMonth) {
    const maxMonth = clamp?.maxMonth?.(year) ?? 12;
    month = Math.min(maxMonth, Math.max(1, month));
  }

  const monthValue = preserveMonth ? padCalendarDatePart(month) : "";
  let day = preserveDay && preserveMonth ? parts.day : 0;
  if (preserveDay && preserveMonth) {
    const maxDay =
      clamp?.maxDay?.(year, month) ?? defaultMaxDay(calendarType);
    day = Math.min(maxDay, Math.max(1, day));
  }

  return {
    calendarType,
    year: yearValue,
    month: monthValue,
    day: preserveDay && preserveMonth ? padCalendarDatePart(day) : "",
  };
}

/**
 * Convert a (possibly partial) calendar date between Hijri and Gregorian
 * without clearing filled selects. Missing month/day stay empty after switch.
 */
export function convertCalendarDateValue(
  value: CalendarDateValue,
  nextCalendarType: CalendarType,
  clamp?: ConvertCalendarDateClamp,
): CalendarDateValue {
  if (value.calendarType === nextCalendarType) {
    return value;
  }

  const year = parsePart(value.year);
  const month = parsePart(value.month);
  const day = parsePart(value.day);

  if (year === null) {
    return {
      calendarType: nextCalendarType,
      day: "",
      month: "",
      year: "",
    };
  }

  const preserveMonth = month !== null;
  const preserveDay = day !== null;
  const sourceParts: CalendarDateParts = {
    year,
    month: month ?? 1,
    day: day ?? 1,
  };

  const converted =
    convertCalendarDateParts(
      sourceParts,
      value.calendarType,
      nextCalendarType,
    ) ??
    ({
      year:
        value.calendarType === "hijri" ? year + 579 : year - 579,
      month: sourceParts.month,
      day: sourceParts.day,
    } satisfies CalendarDateParts);

  return clampConvertedDate(
    nextCalendarType,
    converted,
    preserveMonth,
    preserveDay,
    clamp,
  );
}
