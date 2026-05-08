import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
