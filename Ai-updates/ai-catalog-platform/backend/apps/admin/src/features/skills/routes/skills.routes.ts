import { Router } from 'express';
import { SkillsController } from '../controllers/skills.controller';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { idParamSchema, createSkillSchema, updateSkillSchema } from '../validators/skills.validator';

const router = Router();
const ctrl = new SkillsController();

router.use(authenticate, requireAdmin);

router.get('/', ctrl.getSkills);
router.get('/:id', validate(idParamSchema), ctrl.getSkill);
router.post('/', validate(createSkillSchema), ctrl.createSkill);
router.put('/:id', validate(updateSkillSchema), ctrl.updateSkill);
router.delete('/:id', validate(idParamSchema), ctrl.deleteSkill);

export default router;
