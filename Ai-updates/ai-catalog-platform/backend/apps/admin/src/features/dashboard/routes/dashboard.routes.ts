import { Router } from 'express';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/', dashboardController.getSummary);
router.get('/stats', dashboardController.getStats);

export default router;
