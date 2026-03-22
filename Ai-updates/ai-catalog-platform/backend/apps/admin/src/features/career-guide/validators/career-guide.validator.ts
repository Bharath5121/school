import { z } from 'zod';

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const createGuideSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    description: z.string().min(1).max(10000),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    timeRequired: z.string().min(1).max(100),
    toolsNeeded: z.array(z.string()).optional(),
    industrySlug: z.string().min(1),
    whatYouLearn: z.string().min(1).max(10000),
    steps: z.any().optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
  }).strict(),
});

export const updateGuideSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    description: z.string().min(1).max(10000).optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    timeRequired: z.string().min(1).max(100).optional(),
    toolsNeeded: z.array(z.string()).optional(),
    industrySlug: z.string().min(1).optional(),
    whatYouLearn: z.string().min(1).max(10000).optional(),
    steps: z.any().optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
  }).strict(),
});
