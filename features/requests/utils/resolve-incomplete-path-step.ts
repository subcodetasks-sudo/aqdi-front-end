export type IncompletePathStepStatus = "completed" | "current" | "pending";

export type IncompletePathStepKey =
  | "contractType"
  | "deed"
  | "owner"
  | "tenant"
  | "unit"
  | "finance"
  | "payment";

export const INCOMPLETE_PATH_STEP_KEYS: IncompletePathStepKey[] = [
  "contractType",
  "deed",
  "owner",
  "tenant",
  "unit",
  "finance",
  "payment",
];

/**
 * Maps API `contract.step` to the visual path index (1..7).
 * Backend steps: 1–2 deed/address, 3 owner, 4 tenant, 5 unit, 6 finance, 7 payment.
 * Path step 1 (contract type) is always completed once a request exists.
 */
export function resolveIncompletePathCurrentStep(step: number) {
  if (!Number.isFinite(step) || step <= 0) {
    return 2;
  }

  if (step <= 2) {
    return 2;
  }

  return Math.min(Math.trunc(step), 7);
}

export function getIncompletePathStepStatus(
  stepIndex: number,
  currentStep: number,
): IncompletePathStepStatus {
  if (stepIndex < currentStep) {
    return "completed";
  }

  if (stepIndex === currentStep) {
    return "current";
  }

  return "pending";
}
