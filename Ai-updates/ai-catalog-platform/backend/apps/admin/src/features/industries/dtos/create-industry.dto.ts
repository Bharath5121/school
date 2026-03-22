import { z } from 'zod';
import { createIndustrySchema, updateIndustrySchema } from '../validators/industry-admin.validator';

export type CreateIndustryDto = z.infer<typeof createIndustrySchema>['body'];
export type UpdateIndustryDto = z.infer<typeof updateIndustrySchema>['body'];
