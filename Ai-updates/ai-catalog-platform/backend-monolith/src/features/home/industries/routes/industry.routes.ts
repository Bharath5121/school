import { Router } from 'express';
import { IndustryController } from '../controllers/industry.controller';

const router = Router();
const controller = new IndustryController();

router.get('/industries', controller.getAll);
router.get('/industries/:slug', controller.getBySlug);
router.get('/stats', controller.getStats);
router.get('/field-stats', controller.getFieldStats);
router.get('/field-latest/:slug', controller.getLatestByField);

export default router;
