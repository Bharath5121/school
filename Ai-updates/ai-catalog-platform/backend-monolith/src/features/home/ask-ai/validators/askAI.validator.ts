import { z } from 'zod';

export const askQuestionSchema = z.object({
  body: z.object({
    question: z.string().min(1, 'Question is required').max(2000, 'Question is too long'),
    fieldSlug: z.string().min(1, 'fieldSlug is required').max(100),
  }).strict(),
});

export const getQuestionsSchema = z.object({
  params: z.object({
    slug: z.string().min(1).max(100),
  }),
});
