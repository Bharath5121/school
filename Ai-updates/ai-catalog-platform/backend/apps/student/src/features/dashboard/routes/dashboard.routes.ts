import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { DashboardController } from '../controllers/dashboard.controller';
import { DashboardSummaryController } from '../controllers/dashboard-summary.controller';

const router = Router();

router.use(authenticate);

router.get('/', DashboardController.getOverview);
router.get('/summary', DashboardSummaryController.getSummary);

export default router;
