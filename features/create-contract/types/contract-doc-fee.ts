export type ContractDocFeeData = {
  amount?: number;
  doc_fee?: number;
  doc_fee_lines?: string[] | null;
  text?: string | null;
  has_extra_months?: boolean;
};

export type ContractDocFeeApiResponse = {
  message: string;
  code: number;
  success: boolean;
  data: ContractDocFeeData;
};

export type ContractDocFeePreview = {
  amount: number;
  lines: string[];
  hasExtraMonths: boolean;
};

export function resolveContractDocFeePreview(
  data: ContractDocFeeData,
): ContractDocFeePreview {
  const amount = Number(data.doc_fee ?? data.amount ?? 0);
  const linesFromArray = Array.isArray(data.doc_fee_lines)
    ? data.doc_fee_lines.filter((line) => line.trim() !== "")
    : [];
  const linesFromText =
    typeof data.text === "string" && data.text.trim() !== ""
      ? data.text
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  return {
    amount: Number.isFinite(amount) ? amount : 0,
    lines: linesFromArray.length > 0 ? linesFromArray : linesFromText,
    hasExtraMonths: Boolean(data.has_extra_months),
  };
}
