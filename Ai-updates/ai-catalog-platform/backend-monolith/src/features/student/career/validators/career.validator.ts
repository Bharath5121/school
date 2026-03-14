import { z } from 'zod';

export const markExploredSchema = z.object({
  params: z.object({
    jobId: z.string().min(1),
  }),
});
