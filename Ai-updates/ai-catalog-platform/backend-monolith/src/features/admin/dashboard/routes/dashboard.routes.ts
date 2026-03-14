import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate, requireAdmin } from '../../../../middleware/auth.middleware';

const router = Router();
const controller = new DashboardController();
router.get('/summary', authenticate, requireAdmin, controller.getSummary);
export default router;
