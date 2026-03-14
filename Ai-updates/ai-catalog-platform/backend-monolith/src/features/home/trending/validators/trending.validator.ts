import { z } from 'zod';

export const trendingQuerySchema = z.object({
  query: z.object({
    timeframe: z.enum(['today', 'week', 'month']).default('today').optional(),
    limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
  }),
});

export const whatsNewQuerySchema = z.object({
  query: z.object({
    fields: z.string().max(500).optional(),
    type: z.string().max(50).optional(),
    showAll: z.enum(['true', 'false']).optional(),
  }),
});
