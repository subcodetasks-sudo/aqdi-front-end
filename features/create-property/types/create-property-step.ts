export const CREATE_PROPERTY_STEPS = [
  "deed",
  "owner",
  "review",
  "success",
] as const;

export const CREATE_PROPERTY_STEPPER_STEPS = [
  "deed",
  "owner",
  "review",
] as const;

export type CreatePropertyStep = (typeof CREATE_PROPERTY_STEPS)[number];

export type CreatePropertyStepperStep =
  (typeof CREATE_PROPERTY_STEPPER_STEPS)[number];
