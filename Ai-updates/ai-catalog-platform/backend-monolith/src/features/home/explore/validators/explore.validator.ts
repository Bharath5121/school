import { z } from 'zod';

export const listModelsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().max(1000).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    industry: z.string().max(100).optional(),
    builtBy: z.string().max(200).optional(),
    isFree: z.enum(['true', 'false']).optional(),
    search: z.string().max(200).optional(),
  }),
});

export const listAgentsSchema = listModelsSchema;

export const listAppsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().max(1000).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    industry: z.string().max(100).optional(),
    isFree: z.enum(['true', 'false']).optional(),
    whoUsesIt: z.string().max(200).optional(),
    search: z.string().max(200).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
