import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});

export const listBasicsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().max(1000).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    search: z.string().max(200).optional(),
  }),
});

// ─── Chapters ─────────────────────────────────────────────

export const createChapterSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    slug: z.string().regex(slugPattern).max(200),
    description: z.string().max(5000).optional(),
    icon: z.string().max(50).optional(),
    sortOrder: z.coerce.number().int().optional(),
    isPublished: z.boolean().optional(),
  }).strict(),
});

export const updateChapterSchema = z.object({
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

// ─── Topics ───────────────────────────────────────────────

export const createBasicsTopicSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    slug: z.string().regex(slugPattern).max(200),
    tagline: z.string().max(500).optional(),
    description: z.string().max(10000).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
    sortOrder: z.coerce.number().int().optional(),
    concepts: z.array(z.string()).optional(),
    keyTakeaways: z.array(z.string()).optional(),
    difficulty: z.string().max(50).optional(),
    xp: z.coerce.number().int().optional(),
    videoUrl: z.string().url().max(2000).optional().nullable(),
    videoTitle: z.string().max(500).optional().nullable(),
    notebookLmUrl: z.string().url().max(2000).optional().nullable(),
    notebookDescription: z.string().max(5000).optional().nullable(),
    architectureDescription: z.string().max(10000).optional().nullable(),
    architectureDiagramUrl: z.string().url().max(2000).optional().nullable(),
    isPublished: z.boolean().optional(),
    chapterId: z.string().optional().nullable(),
  }).strict(),
});

export const updateBasicsTopicSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    slug: z.string().regex(slugPattern).max(200).optional(),
    tagline: z.string().max(500).optional(),
    description: z.string().max(10000).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
    sortOrder: z.coerce.number().int().optional(),
    concepts: z.array(z.string()).optional(),
    keyTakeaways: z.array(z.string()).optional(),
    difficulty: z.string().max(50).optional(),
    xp: z.coerce.number().int().optional(),
    videoUrl: z.string().url().max(2000).optional().nullable(),
    videoTitle: z.string().max(500).optional().nullable(),
    notebookLmUrl: z.string().url().max(2000).optional().nullable(),
    notebookDescription: z.string().max(5000).optional().nullable(),
    architectureDescription: z.string().max(10000).optional().nullable(),
    architectureDiagramUrl: z.string().url().max(2000).optional().nullable(),
    isPublished: z.boolean().optional(),
    chapterId: z.string().optional().nullable(),
  }).strict(),
});

// ─── Topic Links ──────────────────────────────────────────

export const createTopicLinkSchema = z.object({
  body: z.object({
    topicId: z.string().min(1),
    type: z.enum(['MODEL', 'AGENT', 'APP']),
    name: z.string().min(1).max(500),
    description: z.string().max(2000).optional(),
    redirectUrl: z.string().url().max(2000).optional().nullable(),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});

export const updateTopicLinkSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    type: z.enum(['MODEL', 'AGENT', 'APP']).optional(),
    name: z.string().min(1).max(500).optional(),
    description: z.string().max(2000).optional(),
    redirectUrl: z.string().url().max(2000).optional().nullable(),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});

// ─── Videos ───────────────────────────────────────────────

export const createBasicsVideoSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    url: z.string().url().max(2000),
    channel: z.string().max(200).optional(),
    duration: z.string().max(50).optional(),
    sortOrder: z.coerce.number().int().optional(),
    topicId: z.string().min(1),
  }).strict(),
});

export const updateBasicsVideoSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    url: z.string().url().max(2000).optional(),
    channel: z.string().max(200).optional(),
    duration: z.string().max(50).optional(),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});

// ─── Articles ─────────────────────────────────────────────

export const createBasicsArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(500),
    url: z.string().url().max(2000),
    source: z.string().max(200).optional(),
    sortOrder: z.coerce.number().int().optional(),
    topicId: z.string().min(1),
  }).strict(),
});

export const updateBasicsArticleSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(1).max(500).optional(),
    url: z.string().url().max(2000).optional(),
    source: z.string().max(200).optional(),
    sortOrder: z.coerce.number().int().optional(),
  }).strict(),
});
