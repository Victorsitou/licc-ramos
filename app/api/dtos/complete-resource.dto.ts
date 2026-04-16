import { z } from "zod";

export const completeResourceSchema = z.object({
  resourceId: z.string().cuid(),
});
