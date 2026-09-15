export type ParsedContractPeriodLabel = {
  title: string;
  fee?: string;
};

/**
 * Split API period labels like:
 * "3 شهور (إجمالي الرسوم) 249" → { title: "3 شهور", fee: "249" }
 */
export function parseContractPeriodLabel(
  period: string,
): ParsedContractPeriodLabel {
  const trimmed = period.trim();

  if (!trimmed) {
    return { title: period };
  }

  const feeMatch = trimmed.match(/(?:^|\s)(\d+)\s*$/);
  const fee = feeMatch?.[1];

  const title = trimmed
    .replace(/\(\s*إجمالي\s*الرسوم\s*\)/gi, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/(?:^|\s)\d+\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    title: title || trimmed,
    fee,
  };
}
