import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../shared/utils/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';
import { authLimiter } from '../../../middleware/rate-limiter';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshTokenSchema), controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);

export default router;
