import { z } from 'zod';

export const trackHistorySchema = z.object({
  body: z.object({
    feedItemId: z.string().uuid('Invalid feed item ID'),
    timeSpentSeconds: z.coerce.number().int().min(0).max(86400).optional(),
  }).strict(),
});

export const listHistorySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20).optional(),
    period: z.enum(['today', 'yesterday', 'week', 'month', 'all']).default('all').optional(),
  }),
});
