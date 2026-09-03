import { z } from "zod";

export const updateResourceSchema = z.object({
  title: z.string().optional(),
  key: z.string().optional(),
  type: z.enum(["CLASS", "WORKSHOP", "AYUDANTIA", "EXTRA"]).optional(),
  orderIndex: z.number().int().optional(),
});
