import { Router } from 'express';
import { authenticate } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import { SkillController } from '../controllers/skill.controller';
import { updateSkillStatusSchema } from '../validators/skill.validator';

const router = Router();

router.use(authenticate);

router.get('/', SkillController.getProgress);
router.get('/summary', SkillController.getSummary);
router.put('/:skillId', validate(updateSkillStatusSchema), SkillController.updateStatus);

export default router;
