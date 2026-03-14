import { z } from 'zod';

export const onboardingSchema = z.object({
  body: z.object({
    role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']),
    gradeLevel: z.string().optional(),
    stream: z.string().optional(),
    interests: z.array(z.string()).max(3).default([]),
    learningStyle: z.object({
      dailyTime: z.string(),
      contentPreference: z.array(z.string()),
      emailDigest: z.boolean()
    }),
    parentEmail: z.string().email().optional().or(z.literal(''))
  })
});

export type OnboardingDto = z.infer<typeof onboardingSchema>['body'];
