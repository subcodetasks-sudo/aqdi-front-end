const MIN_ADULT_AGE = 18;
const GREGORIAN_YEAR_START = 1940;
const HIJRI_YEAR_START = 1350;

function getCurrentGregorianYear() {
  return new Date().getFullYear();
}

function getCurrentHijriYear() {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      year: "numeric",
    }).formatToParts(new Date());
    const yearPart = parts.find((part) => part.type === "year")?.value;
    const year = yearPart ? Number(yearPart.replace(/\D/g, "")) : NaN;

    if (Number.isFinite(year) && year > 0) {
      return year;
    }
  } catch {
    // Fallback below.
  }

  return getCurrentGregorianYear() - 579;
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

export function getAdultBirthYearOptions(calendarType: "hijri" | "gregorian") {
  if (calendarType === "hijri") {
    const end = getCurrentHijriYear() - MIN_ADULT_AGE;
    return buildYearOptions(HIJRI_YEAR_START, end);
  }

  const end = getCurrentGregorianYear() - MIN_ADULT_AGE;
  return buildYearOptions(GREGORIAN_YEAR_START, end);
}
