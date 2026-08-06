import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z
    .email()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(uc\.cl|estudiante\.uc\.cl)$/,
      "Debes usar un correo UC válido",
    )
    .optional(),
  courses: z.array(z.string()).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
