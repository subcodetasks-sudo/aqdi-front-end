const ONES = [
  "",
  "واحد",
  "اثنان",
  "ثلاثة",
  "أربعة",
  "خمسة",
  "ستة",
  "سبعة",
  "ثمانية",
  "تسعة",
];

const TEENS = [
  "عشرة",
  "أحد عشر",
  "اثنا عشر",
  "ثلاثة عشر",
  "أربعة عشر",
  "خمسة عشر",
  "ستة عشر",
  "سبعة عشر",
  "ثمانية عشر",
  "تسعة عشر",
];

const TENS = [
  "",
  "",
  "عشرون",
  "ثلاثون",
  "أربعون",
  "خمسون",
  "ستون",
  "سبعون",
  "ثمانون",
  "تسعون",
];

const HUNDREDS = [
  "",
  "مئة",
  "مئتان",
  "ثلاثمئة",
  "أربعمئة",
  "خمسمئة",
  "ستمئة",
  "سبعمئة",
  "ثمانمئة",
  "تسعمئة",
];

type Scale = { singular: string; dual: string; plural: string };

const SCALES: Scale[] = [
  { singular: "", dual: "", plural: "" },
  { singular: "ألف", dual: "ألفان", plural: "آلاف" },
  { singular: "مليون", dual: "مليونان", plural: "ملايين" },
  { singular: "مليار", dual: "ملياران", plural: "مليارات" },
  { singular: "تريليون", dual: "تريليونان", plural: "تريليونات" },
];

function convertBelowThousand(value: number): string {
  const parts: string[] = [];
  const hundredsDigit = Math.floor(value / 100);
  const remainder = value % 100;

  if (hundredsDigit > 0) {
    parts.push(HUNDREDS[hundredsDigit]);
  }

  if (remainder > 0) {
    if (remainder < 10) {
      parts.push(ONES[remainder]);
    } else if (remainder < 20) {
      parts.push(TEENS[remainder - 10]);
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const onesDigit = remainder % 10;
      parts.push(
        onesDigit > 0
          ? `${ONES[onesDigit]} و${TENS[tensDigit]}`
          : TENS[tensDigit],
      );
    }
  }

  return parts.join(" و");
}

function convertGroup(value: number, scale: Scale): string {
  if (value === 1) {
    return scale.singular;
  }

  if (value === 2) {
    return scale.dual;
  }

  if (value >= 3 && value <= 10) {
    return `${convertBelowThousand(value)} ${scale.plural}`;
  }

  return `${convertBelowThousand(value)} ${scale.singular}`;
}

export function numberToArabicWords(value: number): string {
  const integerValue = Math.floor(Math.abs(value));

  if (integerValue === 0) {
    return "صفر";
  }

  const groups: number[] = [];
  let remaining = integerValue;

  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const parts: string[] = [];

  for (let index = groups.length - 1; index >= 0; index -= 1) {
    const group = groups[index];

    if (group === 0) {
      continue;
    }

    if (index === 0) {
      parts.push(convertBelowThousand(group));
      continue;
    }

    const scale = SCALES[index] ?? SCALES[SCALES.length - 1];
    parts.push(convertGroup(group, scale));
  }

  return parts.join(" و");
}
