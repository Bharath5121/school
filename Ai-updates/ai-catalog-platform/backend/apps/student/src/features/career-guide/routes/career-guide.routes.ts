import { Router } from 'express';
import { CareerGuideController } from '../controllers/career-guide.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const ctrl = new CareerGuideController();

router.get('/my-guides', authenticate, ctrl.getMyGuides);
router.get('/guides/:id', ctrl.getGuideDetail);

export default router;
