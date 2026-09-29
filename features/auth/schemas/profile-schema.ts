import { z } from "zod";

type ProfileSchemaMessages = {
  fullNameRequired: string;
  fullNameMin: string;
};

export function createProfileSchema(messages: ProfileSchemaMessages) {
  return z.object({
    fullName: z
      .string()
      .min(1, messages.fullNameRequired)
      .min(3, messages.fullNameMin),
  });
}

export type ProfileFormValues = z.infer<
  ReturnType<typeof createProfileSchema>
>;
