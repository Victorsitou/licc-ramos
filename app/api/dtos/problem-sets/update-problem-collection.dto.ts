import { z } from "zod";

export const updateProblemCollectionDto = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["COMPILADO", "ACTIVIDAD", "SET", "INTERROGACION"]).optional(),
});

export type UpdateProblemCollectionDtoType = z.infer<
  typeof updateProblemCollectionDto
>;
