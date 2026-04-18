import { z } from "zod";

export const updateResourceSchema = z.object({
  title: z.string().min(1).optional(),
  key: z.string().min(1).optional(),
  type: z.enum(["CLASS", "WORKSHOP", "AYUDANTIA"]).optional(),
  orderIndex: z.number().int().optional(),
});
