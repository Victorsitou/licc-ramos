import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z
    .email()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(uc\.cl|estudiante\.uc\.cl)$/,
      "Debes usar un correo UC válido",
    ),
  password: z.string().min(6),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
