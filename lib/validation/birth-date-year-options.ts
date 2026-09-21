import {
  convertCalendarDateParts,
  padCalendarDatePart,
  type CalendarDateParts,
  type CalendarDateValue,
  type CalendarType,
} from "@/lib/validation/convert-calendar-date";

const MIN_ADULT_AGE = 18;
const GREGORIAN_YEAR_START = 1940;
const HIJRI_YEAR_START = 1350;

export type { CalendarType };
export type BirthDateParts = CalendarDateParts;
export type AdultBirthDateValue = CalendarDateValue;

function parsePart(value: string) {
  const parsed = Number(value.replace(/\D/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function compareBirthDateParts(left: BirthDateParts, right: BirthDateParts) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }

  if (left.month !== right.month) {
    return left.month - right.month;
  }

  return left.day - right.day;
}

function getGregorianParts(date: Date): BirthDateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function getHijriParts(date: Date): BirthDateParts | null {
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

function getCalendarParts(date: Date, calendarType: CalendarType): BirthDateParts {
  if (calendarType === "gregorian") {
    return getGregorianParts(date);
  }

  return (
    getHijriParts(date) ?? {
      year: getGregorianParts(date).year - 579,
      month: getGregorianParts(date).month,
      day: getGregorianParts(date).day,
    }
  );
}

function clampConvertedBirthDate(
  calendarType: CalendarType,
  parts: BirthDateParts,
  preserveMonth: boolean,
  preserveDay: boolean,
): AdultBirthDateValue {
  const yearOptions = getAdultBirthYearOptions(calendarType);
  const yearValues = yearOptions.map((option) => Number(option.value));
  const minYear = yearValues[yearValues.length - 1];
  const maxYear = yearValues[0];

  let year = parts.year;
  if (minYear !== undefined && maxYear !== undefined) {
    year = Math.min(maxYear, Math.max(minYear, year));
  }

  const yearValue = String(year);
  const monthOptions = getAdultBirthMonthOptions(calendarType, yearValue);
  let month = preserveMonth ? parts.month : 0;
  if (preserveMonth) {
    const maxMonth = monthOptions.length;
    month = Math.min(maxMonth, Math.max(1, month));
  }

  const monthValue = preserveMonth ? padCalendarDatePart(month) : "";
  const dayOptions = getAdultBirthDayOptions(
    calendarType,
    yearValue,
    monthValue,
  );
  let day = preserveDay && preserveMonth ? parts.day : 0;
  if (preserveDay && preserveMonth) {
    const maxDay = dayOptions.length;
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
 * Convert a (possibly partial) adult birth date between Hijri and Gregorian
 * without clearing filled selects. Missing month/day stay empty after switch.
 */
export function convertAdultBirthDateCalendar(
  value: AdultBirthDateValue,
  nextCalendarType: CalendarType,
): AdultBirthDateValue {
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
  const sourceParts: BirthDateParts = {
    year,
    month: month ?? 1,
    day: day ?? 1,
  };

  const converted =
    convertCalendarDateParts(
      sourceParts,
      value.calendarType,
      nextCalendarType,
    ) ?? {
      year: value.calendarType === "hijri" ? year + 579 : year - 579,
      month: sourceParts.month,
      day: sourceParts.day,
    };

  return clampConvertedBirthDate(
    nextCalendarType,
    converted,
    preserveMonth,
    preserveDay,
  );
}

/**
 * Latest birth date that is still at least 18 years old on `now`.
 * Uses the real calendar day (not year alone), so:
 * - youth birth years never appear in select options
 * - for the newest allowed year, month/day are capped at today's cutoff
 * - when the next cohort turns 18, that year appears automatically
 */
export function getMaxAdultBirthDateParts(
  calendarType: CalendarType,
  now = new Date(),
): BirthDateParts {
  const cutoff = new Date(
    now.getFullYear() - MIN_ADULT_AGE,
    now.getMonth(),
    now.getDate(),
    12,
    0,
    0,
    0,
  );

  return getCalendarParts(cutoff, calendarType);
}

function buildYearOptions(start: number, end: number) {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => {
    const year = String(end - index);
    return { value: year, label: year };
  });
}

function padOptions(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { value, label: value };
  });
}

export function getAdultBirthYearOptions(
  calendarType: CalendarType,
  now = new Date(),
) {
  const maxAdultBirth = getMaxAdultBirthDateParts(calendarType, now);
  const start = calendarType === "hijri" ? HIJRI_YEAR_START : GREGORIAN_YEAR_START;
  return buildYearOptions(start, maxAdultBirth.year);
}

export function getAdultBirthMonthOptions(
  calendarType: CalendarType,
  year: string,
  now = new Date(),
) {
  const selectedYear = parsePart(year);
  const maxAdultBirth = getMaxAdultBirthDateParts(calendarType, now);

  if (selectedYear === maxAdultBirth.year) {
    return padOptions(maxAdultBirth.month);
  }

  return padOptions(12);
}

export function getAdultBirthDayOptions(
  calendarType: CalendarType,
  year: string,
  month: string,
  now = new Date(),
) {
  const selectedYear = parsePart(year);
  const selectedMonth = parsePart(month);
  const maxAdultBirth = getMaxAdultBirthDateParts(calendarType, now);
  const fullDayCount = calendarType === "hijri" ? 30 : 31;

  if (
    selectedYear === maxAdultBirth.year &&
    selectedMonth === maxAdultBirth.month
  ) {
    return padOptions(Math.min(fullDayCount, maxAdultBirth.day));
  }

  return padOptions(fullDayCount);
}

export function isAtLeastAdultAge(
  birthDate: AdultBirthDateValue,
  now = new Date(),
) {
  const year = parsePart(birthDate.year);
  const month = parsePart(birthDate.month);
  const day = parsePart(birthDate.day);

  if (year === null || month === null || day === null) {
    return false;
  }

  const maxAdultBirth = getMaxAdultBirthDateParts(birthDate.calendarType, now);

  return (
    compareBirthDateParts({ year, month, day }, maxAdultBirth) <= 0
  );
}

export function isAdultBirthDateComplete(birthDate: AdultBirthDateValue) {
  return (
    birthDate.day !== "" &&
    birthDate.month !== "" &&
    birthDate.year !== "" &&
    isAtLeastAdultAge(birthDate)
  );
}

/**
 * Drop day/month/year parts that fall outside the live 18+ option lists
 * (e.g. draft/API values for youth, or dates past today's adult cutoff).
 */
export function sanitizeAdultBirthDateValue(
  value: AdultBirthDateValue,
  now = new Date(),
): AdultBirthDateValue {
  const yearOptions = getAdultBirthYearOptions(value.calendarType, now);
  if (
    value.year !== "" &&
    !yearOptions.some((option) => option.value === value.year)
  ) {
    return {
      ...value,
      day: "",
      month: "",
      year: "",
    };
  }

  const monthOptions = getAdultBirthMonthOptions(
    value.calendarType,
    value.year,
    now,
  );
  if (
    value.month !== "" &&
    !monthOptions.some((option) => option.value === value.month)
  ) {
    return {
      ...value,
      day: "",
      month: "",
    };
  }

  const dayOptions = getAdultBirthDayOptions(
    value.calendarType,
    value.year,
    value.month,
    now,
  );
  if (
    value.day !== "" &&
    !dayOptions.some((option) => option.value === value.day)
  ) {
    return {
      ...value,
      day: "",
    };
  }

  return value;
}
