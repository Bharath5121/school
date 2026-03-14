import { z } from 'zod';

export const industrySlugParamSchema = z.object({
  params: z.object({
    industrySlug: z.string().min(1).max(100),
  }),
});

export const jobIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
