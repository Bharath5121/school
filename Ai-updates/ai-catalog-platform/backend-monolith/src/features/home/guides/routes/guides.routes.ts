import { Router } from 'express';
import { GuidesController } from '../controllers/guides.controller';
import { validate } from '../../../../shared/utils/validate';
import { listGuidesSchema, guideIdSchema, listPromptsSchema } from '../validators/guides.validator';

const router = Router();

router.get('/guides', validate(listGuidesSchema), GuidesController.listGuides);
router.get('/guides/:id', validate(guideIdSchema), GuidesController.getGuide);
router.get('/prompts', validate(listPromptsSchema), GuidesController.listPrompts);

export default router;
