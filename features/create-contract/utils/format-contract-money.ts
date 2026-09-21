/**
 * Format SAR amounts for AQDI financial summary.
 * Arabic locale with Latin digits, always 2 decimals.
 * Example amount: `249.00`
 * Example with currency: `249.00 ر.س`
 */
export function formatContractMoneyAmount(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("ar-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    numberingSystem: "latn",
  }).format(safe);
}

export function formatContractMoney(
  amount: number,
  currency = "ر.س",
): string {
  return `${formatContractMoneyAmount(amount)} ${currency}`;
}
