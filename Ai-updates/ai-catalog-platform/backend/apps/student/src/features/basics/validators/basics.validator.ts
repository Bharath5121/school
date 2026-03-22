import { z } from 'zod';

export const topicSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1).max(200),
  }),
});
