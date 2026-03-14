import { z } from 'zod';

export const listGuidesSchema = z.object({
  query: z.object({
    industry: z.string().max(100).optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    page: z.coerce.number().int().positive().max(1000).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  }),
});

export const guideIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listPromptsSchema = z.object({
  query: z.object({
    industry: z.string().max(100).optional(),
    page: z.coerce.number().int().positive().max(1000).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
  }),
});
