import { z } from 'zod';
import { createSkillSchema, updateSkillSchema } from '../validators/skills.validator';

export type CreateSkillDto = z.infer<typeof createSkillSchema>['body'];
export type UpdateSkillDto = z.infer<typeof updateSkillSchema>['body'];
