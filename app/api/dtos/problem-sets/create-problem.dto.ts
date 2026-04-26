import { z } from "zod";

export const CreateProblemDto = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export type CreateProblemDtoType = z.infer<typeof CreateProblemDto>;
