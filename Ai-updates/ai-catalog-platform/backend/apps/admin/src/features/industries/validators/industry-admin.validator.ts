import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1, 'ID is required') }),
});

export const createIndustrySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    slug: z.string().regex(slugPattern).max(100),
    description: z.string().max(2000).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
  }).strict(),
});

export const updateIndustrySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    slug: z.string().regex(slugPattern).max(100).optional(),
    description: z.string().max(2000).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
  }).strict(),
});
