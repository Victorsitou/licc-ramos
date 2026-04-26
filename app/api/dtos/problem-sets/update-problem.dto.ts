import { z } from "zod";

export const updateProblemDto = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateProblemDtoType = z.infer<typeof updateProblemDto>;
