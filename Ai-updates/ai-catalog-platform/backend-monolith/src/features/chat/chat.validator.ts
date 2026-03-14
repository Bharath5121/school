import { z } from 'zod';

export const getMessagesSchema = z.object({
  query: z.object({
    channel: z.string().default('general'),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    after: z.string().optional(),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    channel: z.string().min(1).max(50).default('general'),
    message: z.string().min(1).max(2000),
  }),
});
