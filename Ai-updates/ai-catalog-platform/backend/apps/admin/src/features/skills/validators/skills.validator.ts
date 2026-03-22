import { z } from 'zod';

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(500),
    description: z.string().min(1).max(10000),
    industrySlug: z.string().min(1),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    whyItMatters: z.string().min(1).max(10000),
    learnUrl: z.string().url().optional().or(z.literal('')),
    notebookLmUrl: z.string().url().optional().or(z.literal('')),
    timeToLearn: z.string().min(1).max(100),
    category: z.string().min(1).max(200),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});

export const updateSkillSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(500).optional(),
    description: z.string().min(1).max(10000).optional(),
    industrySlug: z.string().min(1).optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    whyItMatters: z.string().min(1).max(10000).optional(),
    learnUrl: z.string().url().optional().or(z.literal('')),
    notebookLmUrl: z.string().url().optional().or(z.literal('')),
    timeToLearn: z.string().min(1).max(100).optional(),
    category: z.string().min(1).max(200).optional(),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});
