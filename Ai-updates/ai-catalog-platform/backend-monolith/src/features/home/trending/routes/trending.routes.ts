import { Router } from 'express';
import { TrendingController } from '../controllers/trending.controller';
import { validate } from '../../../../shared/utils/validate';
import { trendingQuerySchema, whatsNewQuerySchema } from '../validators/trending.validator';

const router = Router();

router.get('/trending', validate(trendingQuerySchema), TrendingController.getTrending);
router.get('/whats-new', validate(whatsNewQuerySchema), TrendingController.getWhatsNew);

export default router;
