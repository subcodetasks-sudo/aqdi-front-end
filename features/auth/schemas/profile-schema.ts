import { z } from "zod";

type ProfileSchemaMessages = {
  fullNameRequired: string;
  fullNameMin: string;
  passwordMin: string;
};

export function createProfileSchema(messages: ProfileSchemaMessages) {
  return z.object({
    fullName: z
      .string()
      .min(1, messages.fullNameRequired)
      .min(3, messages.fullNameMin),
    password: z
      .string()
      .optional()
      .refine(
        (value) => !value || value.length >= 8,
        messages.passwordMin,
      ),
  });
}

export type ProfileFormValues = z.infer<
  ReturnType<typeof createProfileSchema>
>;
