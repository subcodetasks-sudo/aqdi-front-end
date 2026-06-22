export const CREATE_CONTRACT_STEPS = [
  "intro",
  "deed",
  "owner",
  "tenant",
  "finance",
] as const;

export type CreateContractStep = (typeof CREATE_CONTRACT_STEPS)[number];
