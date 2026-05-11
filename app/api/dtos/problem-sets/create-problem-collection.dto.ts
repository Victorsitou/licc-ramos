import { z } from "zod";

export const CreateProblemCollectionDto = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["COMPILADO", "ACTIVIDAD", "SET", "INTERROGACION"]),
});

export type CreateProblemCollectionDtoType = z.infer<
  typeof CreateProblemCollectionDto
>;
