import { z } from 'zod';

export const listQuerySchema = z.object({
  query: z.object({
    featured: z.enum(['true', 'false']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});

export const slugParamSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

export const chatMessageSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
  body: z.object({
    message: z.string().min(1).max(5000),
  }),
});
