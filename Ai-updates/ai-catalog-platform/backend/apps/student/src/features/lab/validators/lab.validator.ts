import { z } from 'zod';

export const slugParamSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

export const chatMessageSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
  body: z.object({
    message: z.string().min(1).max(5000),
  }),
});
