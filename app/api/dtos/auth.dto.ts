import { z } from "zod";

export const loginUserSchema = z.object({
  email: z
    .email()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(uc\.cl|estudiante\.uc\.cl)$/,
      "Debes usar un correo UC válido",
    ),
  password: z.string(),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
