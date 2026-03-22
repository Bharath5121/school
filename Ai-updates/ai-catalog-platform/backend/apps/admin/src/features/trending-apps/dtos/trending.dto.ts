import { z } from 'zod';
import { createCategorySchema, updateCategorySchema, createAppSchema, updateAppSchema } from '../validators/trending.validator';

export type CreateCategoryDto = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>['body'];
export type CreateAppDto = z.infer<typeof createAppSchema>['body'];
export type UpdateAppDto = z.infer<typeof updateAppSchema>['body'];
