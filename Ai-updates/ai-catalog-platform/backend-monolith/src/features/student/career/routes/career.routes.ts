import { Router } from 'express';
import { authenticate } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import { CareerController } from '../controllers/career.controller';
import { markExploredSchema } from '../validators/career.validator';

const router = Router();

router.use(authenticate);

router.get('/', CareerController.getExplored);
router.get('/stats', CareerController.getStats);
router.post('/explored/:jobId', validate(markExploredSchema), CareerController.markExplored);
router.delete('/explored/:jobId', validate(markExploredSchema), CareerController.removeExplored);

export default router;
