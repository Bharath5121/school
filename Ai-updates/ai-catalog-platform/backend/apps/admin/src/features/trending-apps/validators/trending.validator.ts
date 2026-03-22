import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const createCategorySchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    slug: z.string().regex(slugPattern).max(200),
    description: z.string().max(5000).optional(),
    icon: z.string().max(50).optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
  }).strict(),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    slug: z.string().regex(slugPattern).max(200).optional(),
    description: z.string().max(5000).optional(),
    icon: z.string().max(50).optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
  }).strict(),
});

export const createAppSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(500),
    slug: z.string().regex(slugPattern).max(200),
    tagline: z.string().max(500).optional(),
    description: z.string().max(10000).optional(),
    icon: z.string().max(50).optional(),
    provider: z.string().max(200).optional(),
    url: z.string().max(2000).optional(),
    isFree: z.boolean().optional(),
    isAd: z.boolean().optional(),
    logoUrl: z.string().max(2000).optional().nullable(),
    coverImageUrl: z.string().max(2000).optional().nullable(),
    usage: z.string().max(10000).optional().nullable(),
    howItHelps: z.string().max(10000).optional().nullable(),
    launchDate: z.coerce.date().optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
    categoryId: z.string().min(1),
    industrySlug: z.string().max(200).optional().nullable(),
  }).strict(),
});

export const updateAppSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).max(500).optional(),
    slug: z.string().regex(slugPattern).max(200).optional(),
    tagline: z.string().max(500).optional(),
    description: z.string().max(10000).optional(),
    icon: z.string().max(50).optional(),
    logoUrl: z.string().max(2000).optional().nullable(),
    coverImageUrl: z.string().max(2000).optional().nullable(),
    provider: z.string().max(200).optional(),
    url: z.string().max(2000).optional(),
    isFree: z.boolean().optional(),
    isAd: z.boolean().optional(),
    usage: z.string().max(10000).optional().nullable(),
    howItHelps: z.string().max(10000).optional().nullable(),
    launchDate: z.coerce.date().optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
    categoryId: z.string().min(1).optional(),
    industrySlug: z.string().max(200).optional().nullable(),
  }).strict(),
});
