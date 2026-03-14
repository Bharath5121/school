import { Router } from 'express';
import { authenticate } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import { HistoryController } from '../controllers/history.controller';
import { trackHistorySchema, listHistorySchema } from '../validators/history.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(listHistorySchema), HistoryController.list);
router.post('/', validate(trackHistorySchema), HistoryController.track);
router.get('/stats', HistoryController.stats);
router.delete('/', HistoryController.clear);

export default router;
