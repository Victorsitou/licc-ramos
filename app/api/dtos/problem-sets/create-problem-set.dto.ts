import { z } from "zod";

export const CreateProblemSetDto = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export type CreateProblemSetDtoType = z.infer<typeof CreateProblemSetDto>;
