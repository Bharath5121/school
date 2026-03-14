import { z } from 'zod';
import { FeedContentType } from '../types/feed.types';

export const createFeedSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    summary: z.string().min(10),
    content: z.string().optional(),
    contentType: z.nativeEnum(FeedContentType),
    fieldSlug: z.string().min(2),
    targetRole: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']).optional(),
    careerImpactScore: z.number().min(0).max(100).optional(),
    careerImpactText: z.string().optional(),
    metadata: z.any().optional()
  }).strict()
});

export const updateFeedSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    summary: z.string().min(10).optional(),
    content: z.string().optional(),
    contentType: z.nativeEnum(FeedContentType).optional(),
    fieldSlug: z.string().min(2).optional(),
    targetRole: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']).optional(),
    careerImpactScore: z.number().min(0).max(100).optional(),
    careerImpactText: z.string().optional(),
    metadata: z.any().optional()
  }).strict(),
  params: z.object({
    id: z.string().uuid()
  })
});

export const queryFeedSchema = z.object({
  query: z.object({
    fieldSlug: z.string().optional(),
    contentType: z.nativeEnum(FeedContentType).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  }).strict()
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});
