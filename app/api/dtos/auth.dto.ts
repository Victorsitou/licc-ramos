import { z } from "zod";

export const loginUserSchema = z.object({
  email: z
    .email()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(uc\.cl|estudiante\.uc\.cl)$/,
      "Debes usar un correo UC válido",
    ),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
