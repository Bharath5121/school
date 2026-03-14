import { z } from 'zod';

export const queryFeedSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  field: z.string().optional(),
  search: z.string().optional()
});
