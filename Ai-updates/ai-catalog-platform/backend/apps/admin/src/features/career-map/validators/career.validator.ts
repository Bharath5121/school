import { z } from 'zod';

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const createPathSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    description: z.string().min(1).max(10000),
    aiImpactSummary: z.string().min(1).max(10000),
    industrySlug: z.string().min(1),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});

export const updatePathSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    description: z.string().min(1).max(10000).optional(),
    aiImpactSummary: z.string().min(1).max(10000).optional(),
    industrySlug: z.string().min(1).optional(),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});

export const createJobSchema = z.object({
  body: z.object({
    careerPathId: z.string().min(1),
    title: z.string().min(1).max(500),
    salaryRangeMin: z.coerce.number().int().min(0),
    salaryRangeMax: z.coerce.number().int().min(0),
    currency: z.string().max(10).optional(),
    demand: z.enum(['GROWING', 'STABLE', 'AT_RISK']).optional(),
    requiredDegree: z.string().min(1).max(500),
    requiredSkills: z.array(z.string()).optional(),
    futureSkills: z.array(z.string()).optional(),
    howAiChanges: z.string().min(1).max(10000),
    timeline: z.enum(['NOW', 'YEAR_2030', 'FUTURE']).optional(),
    googleUrl: z.string().url().optional().or(z.literal('')),
    notebookLmUrl: z.string().url().optional().or(z.literal('')),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});

export const updateJobSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    careerPathId: z.string().min(1).optional(),
    title: z.string().min(1).max(500).optional(),
    salaryRangeMin: z.coerce.number().int().min(0).optional(),
    salaryRangeMax: z.coerce.number().int().min(0).optional(),
    currency: z.string().max(10).optional(),
    demand: z.enum(['GROWING', 'STABLE', 'AT_RISK']).optional(),
    requiredDegree: z.string().min(1).max(500).optional(),
    requiredSkills: z.array(z.string()).optional(),
    futureSkills: z.array(z.string()).optional(),
    howAiChanges: z.string().min(1).max(10000).optional(),
    timeline: z.enum(['NOW', 'YEAR_2030', 'FUTURE']).optional(),
    googleUrl: z.string().url().optional().or(z.literal('')),
    notebookLmUrl: z.string().url().optional().or(z.literal('')),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});
