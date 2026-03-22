import { Router } from 'express';
import { SkillsController } from '../controllers/skills.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const ctrl = new SkillsController();

router.get('/my-skills', authenticate, ctrl.getMySkills);
router.get('/:id', ctrl.getSkillDetail);

export default router;
