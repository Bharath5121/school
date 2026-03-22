import { z } from 'zod';
import { createGuideSchema, updateGuideSchema } from '../validators/career-guide.validator';

export type CreateGuideDto = z.infer<typeof createGuideSchema>['body'];
export type UpdateGuideDto = z.infer<typeof updateGuideSchema>['body'];
