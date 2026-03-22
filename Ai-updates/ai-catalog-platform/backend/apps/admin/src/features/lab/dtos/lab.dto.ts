import { z } from 'zod';
import { createCategorySchema, updateCategorySchema, createItemSchema, updateItemSchema } from '../validators/lab.validator';

export type CreateCategoryDto = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>['body'];
export type CreateItemDto = z.infer<typeof createItemSchema>['body'];
export type UpdateItemDto = z.infer<typeof updateItemSchema>['body'];
