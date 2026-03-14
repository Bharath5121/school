import { z } from 'zod';

export const addBookmarkSchema = z.object({
  body: z.object({
    feedItemId: z.string().uuid(),
  }),
});

export const listBookmarksSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20).optional(),
    contentType: z.string().optional(),
  }),
});

export const removeBookmarkSchema = z.object({
  params: z.object({
    itemId: z.string().min(1),
  }),
});
