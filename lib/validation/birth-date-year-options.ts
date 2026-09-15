const MIN_ADULT_AGE = 18;
const GREGORIAN_YEAR_START = 1940;
const HIJRI_YEAR_START = 1350;

export type CalendarType = "hijri" | "gregorian";

export type BirthDateParts = {
  year: number;
  month: number;
  day: number;
};

export type AdultBirthDateValue = {
  calendarType: CalendarType;
  day: string;
  month: string;
  year: string;
};

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

/**
 * Latest birth date that is still at least 18 years old today.
 * Age is computed from today's real date (day + month + year), not year alone.
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

export function getAdultBirthYearOptions(calendarType: CalendarType) {
  const maxAdultBirth = getMaxAdultBirthDateParts(calendarType);
  const start = calendarType === "hijri" ? HIJRI_YEAR_START : GREGORIAN_YEAR_START;
  return buildYearOptions(start, maxAdultBirth.year);
}

export function getAdultBirthMonthOptions(
  calendarType: CalendarType,
  year: string,
) {
  const selectedYear = parsePart(year);
  const maxAdultBirth = getMaxAdultBirthDateParts(calendarType);

  if (selectedYear === maxAdultBirth.year) {
    return padOptions(maxAdultBirth.month);
  }

  return padOptions(12);
}

export function getAdultBirthDayOptions(
  calendarType: CalendarType,
  year: string,
  month: string,
) {
  const selectedYear = parsePart(year);
  const selectedMonth = parsePart(month);
  const maxAdultBirth = getMaxAdultBirthDateParts(calendarType);
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
