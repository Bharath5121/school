import { z } from 'zod';

export const addContentBookmarkSchema = z.object({
  body: z.object({
    contentType: z.enum(['MODEL', 'AGENT', 'APP', 'GUIDE', 'PROMPT', 'CAREER_JOB', 'SKILL']),
    contentId: z.string().min(1),
    title: z.string().min(1).max(500),
    url: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
});

export const removeContentBookmarkSchema = z.object({
  params: z.object({
    contentType: z.string().min(1),
    contentId: z.string().min(1),
  }),
});
