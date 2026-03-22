import { z } from 'zod';
import { createPathSchema, updatePathSchema, createJobSchema, updateJobSchema } from '../validators/career.validator';

export type CreatePathDto = z.infer<typeof createPathSchema>['body'];
export type UpdatePathDto = z.infer<typeof updatePathSchema>['body'];
export type CreateJobDto = z.infer<typeof createJobSchema>['body'];
export type UpdateJobDto = z.infer<typeof updateJobSchema>['body'];
