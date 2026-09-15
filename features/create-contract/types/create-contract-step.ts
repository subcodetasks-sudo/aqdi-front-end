export const CREATE_CONTRACT_STEPS = [
  "intro",
  "deed",
  "owner",
  "tenant",
  "finance",
  "payment",
] as const;

export const CREATE_CONTRACT_STEPPER_STEPS = CREATE_CONTRACT_STEPS.filter(
  (step) => step !== "payment",
);

export type CreateContractStep = (typeof CREATE_CONTRACT_STEPS)[number];
