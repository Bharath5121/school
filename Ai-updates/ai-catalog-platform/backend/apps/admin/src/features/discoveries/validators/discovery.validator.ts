import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1, 'ID is required') }),
});

export const listQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    industrySlug: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const createDiscoverySchema = z.object({
  body: z.object({
    title: z.string().min(1).max(300),
    slug: z.string().regex(slugPattern).max(200),
    summary: z.string().min(1).max(2000),
    description: z.string().min(1),
    coverImageUrl: z.string().url().max(2000).optional().or(z.literal('')),
    industrySlug: z.string().regex(slugPattern).max(100),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    videoUrl: z.string().url().max(2000).optional().or(z.literal('')),
    videoTitle: z.string().max(300).optional().or(z.literal('')),
    notebookLmUrl: z.string().url().max(2000).optional().or(z.literal('')),
    notebookDescription: z.string().max(5000).optional().or(z.literal('')),
    architectureDescription: z.string().max(10000).optional().or(z.literal('')),
    architectureDiagramUrl: z.string().url().max(2000).optional().or(z.literal('')),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    sortOrder: z.coerce.number().int().optional(),
    xp: z.coerce.number().int().min(0).optional(),
    links: z.array(z.object({
      type: z.enum(['MODEL', 'AGENT', 'APP']),
      name: z.string().min(1).max(300),
      description: z.string().max(2000).optional().or(z.literal('')),
      redirectUrl: z.string().url().max(2000).optional().or(z.literal('')),
      sortOrder: z.coerce.number().int().optional(),
    })).optional(),
  }),
});

export const updateDiscoverySchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: createDiscoverySchema.shape.body.partial(),
});

export const addLinkSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    type: z.enum(['MODEL', 'AGENT', 'APP']),
    name: z.string().min(1).max(300),
    description: z.string().max(2000).optional().or(z.literal('')),
    redirectUrl: z.string().url().max(2000).optional().or(z.literal('')),
    sortOrder: z.coerce.number().int().optional(),
  }),
});

export const removeLinkSchema = z.object({
  params: z.object({
    id: z.string().min(1),
    linkId: z.string().min(1),
  }),
});
