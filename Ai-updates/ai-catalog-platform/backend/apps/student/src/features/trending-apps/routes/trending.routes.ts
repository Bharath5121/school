import { Router } from 'express';
import { TrendingController } from '../controllers/trending.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const ctrl = new TrendingController();

router.get('/categories', ctrl.getCategories);
router.get('/categories/:slug', ctrl.getCategoryBySlug);
router.get('/by-industry/:slug', ctrl.getByIndustry);
router.get('/my-apps', authenticate, ctrl.getMyApps);
router.get('/app/:slug', ctrl.getAppDetail);

export default router;
