import { z } from "zod";

export const updateProblemSetDto = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateProblemSetDtoType = z.infer<typeof updateProblemSetDto>;
