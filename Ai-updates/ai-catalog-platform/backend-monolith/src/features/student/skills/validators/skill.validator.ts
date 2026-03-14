import { z } from 'zod';

export const updateSkillStatusSchema = z.object({
  params: z.object({
    skillId: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(['NOT_STARTED', 'EXPLORING', 'LEARNED']),
  }).strict(),
});
