import { Router } from 'express';
import { OnboardingController } from '../controllers/onboarding.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const ctrl = new OnboardingController();

router.get('/industries', ctrl.getIndustries);
router.get('/status', authenticate, ctrl.getStatus);
router.post('/complete', authenticate, ctrl.completeOnboarding);

export default router;
