import { Router } from 'express';
import { onboardingController } from '../controllers/onboarding.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { onboardingSchema } from '../validators/onboarding.validator';

const router = Router();

router.post('/', authenticate, validate(onboardingSchema), onboardingController.onboard);

export default router;
