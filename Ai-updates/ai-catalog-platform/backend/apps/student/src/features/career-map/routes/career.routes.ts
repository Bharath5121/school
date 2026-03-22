import { Router } from 'express';
import { CareerController } from '../controllers/career.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const ctrl = new CareerController();

router.get('/my-paths', authenticate, ctrl.getMyPaths);
router.get('/jobs/:id', ctrl.getJobDetail);

export default router;
