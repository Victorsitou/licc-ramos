import { z } from "zod";

export const uploadFileSchema = z.object({
  content: z.base64(),
  resourceData: z.object({
    title: z.string(),
    key: z.string(),
    type: z.enum(["CLASS", "WORKSHOP", "AYUDANTIA"]),
    slug: z.string().optional(),
    orderIndex: z.number().int().optional(),
  }),
});

export type UploadFileDto = z.infer<typeof uploadFileSchema>;
