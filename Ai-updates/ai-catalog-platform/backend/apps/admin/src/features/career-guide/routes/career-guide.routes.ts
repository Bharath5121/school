import { Router } from 'express';
import { CareerGuideController } from '../controllers/career-guide.controller';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { idParamSchema, createGuideSchema, updateGuideSchema } from '../validators/career-guide.validator';

const router = Router();
const ctrl = new CareerGuideController();

router.use(authenticate, requireAdmin);

router.get('/guides', ctrl.getGuides);
router.get('/guides/:id', validate(idParamSchema), ctrl.getGuide);
router.post('/guides', validate(createGuideSchema), ctrl.createGuide);
router.put('/guides/:id', validate(updateGuideSchema), ctrl.updateGuide);
router.delete('/guides/:id', validate(idParamSchema), ctrl.deleteGuide);

export default router;
