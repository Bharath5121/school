import { Router } from 'express';
import { industryController } from '../controllers/industry.controller';

const router = Router();

router.get('/', industryController.getAll);
router.get('/:slug', industryController.getBySlug);

export default router;
