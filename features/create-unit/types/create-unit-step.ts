export const CREATE_UNIT_STEPS = ["form", "success"] as const;

export type CreateUnitStep = (typeof CREATE_UNIT_STEPS)[number];
