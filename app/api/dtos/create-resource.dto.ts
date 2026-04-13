import { z } from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  type: z.enum(["CLASS", "WORKSHOP", "AYUDANTIA"]),
  slug: z.string().optional(),
  orderIndex: z.number().int().optional(),
});

export type CreateResourceDto = z.infer<typeof createResourceSchema>;
