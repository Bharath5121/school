import { z } from 'zod';

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']),
  }).strict(),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().max(1000).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    role: z.enum(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN']).optional(),
    search: z.string().max(200).optional(),
  }),
});
