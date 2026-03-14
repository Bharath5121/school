import { z } from 'zod';

const slugPattern = /^[a-z0-9-]+$/;

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});

export const createNotebookSchema = z.object({
  body: z.object({
    industrySlug: z.string().regex(slugPattern).max(100),
    category: z.enum(['MODELS', 'AGENTS', 'APPS', 'CLASS']),
    title: z.string().min(1).max(500),
    description: z.string().max(2000).optional(),
    gradeLevel: z.string().max(50).optional(),
    difficultyLevel: z.enum(['Basics', 'Intermediate', 'Advanced']).optional(),
  }).strict(),
});

export const updateNotebookSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    description: z.string().max(2000).optional(),
    gradeLevel: z.string().max(50).optional(),
    difficultyLevel: z.enum(['Basics', 'Intermediate', 'Advanced']).optional(),
    published: z.boolean().optional(),
  }).strict(),
});

export const addSourceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Notebook ID is required'),
  }),
  body: z.object({
    type: z.enum(['URL', 'PDF', 'TEXT', 'VIDEO', 'YOUTUBE']),
    title: z.string().min(1).max(500),
    url: z.string().url().max(2000).optional().or(z.literal('')),
    metadata: z.record(z.any()).optional(),
    sortOrder: z.number().int().min(0).optional(),
  }).strict(),
});

export const deleteSourceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Notebook ID is required'),
    sourceId: z.string().min(1, 'Source ID is required'),
  }),
});

export const studentAccessSchema = z.object({
  params: z.object({
    industrySlug: z.string().regex(slugPattern).max(100),
    category: z.enum(['MODELS', 'AGENTS', 'APPS', 'CLASS']),
  }),
});

export const industrySlugQuerySchema = z.object({
  query: z.object({
    industrySlug: z.string().regex(slugPattern).max(100).optional(),
  }),
});

export const chatMessageSchema = z.object({
  params: z.object({
    notebookId: z.string().min(1, 'Notebook ID is required'),
  }),
  body: z.object({
    message: z.string().min(1).max(5000),
  }).strict(),
});

export const chatHistorySchema = z.object({
  params: z.object({
    notebookId: z.string().min(1, 'Notebook ID is required'),
  }),
});

export const uploadLinkSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Notebook ID is required'),
  }),
  body: z.object({
    type: z.enum(['URL', 'YOUTUBE']),
    url: z.string().url().max(2000),
    title: z.string().min(1).max(500).optional(),
  }).strict(),
});
