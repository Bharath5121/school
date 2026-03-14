import { z } from 'zod';

export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  }),
});
