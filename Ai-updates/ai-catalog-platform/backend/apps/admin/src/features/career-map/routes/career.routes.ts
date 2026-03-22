import { Router } from 'express';
import { CareerController } from '../controllers/career.controller';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { idParamSchema, createPathSchema, updatePathSchema, createJobSchema, updateJobSchema } from '../validators/career.validator';

const router = Router();
const ctrl = new CareerController();

router.use(authenticate, requireAdmin);

router.get('/paths', ctrl.getPaths);
router.get('/paths/:id', validate(idParamSchema), ctrl.getPath);
router.post('/paths', validate(createPathSchema), ctrl.createPath);
router.put('/paths/:id', validate(updatePathSchema), ctrl.updatePath);
router.delete('/paths/:id', validate(idParamSchema), ctrl.deletePath);

router.get('/jobs', ctrl.getJobs);
router.get('/jobs/:id', validate(idParamSchema), ctrl.getJob);
router.post('/jobs', validate(createJobSchema), ctrl.createJob);
router.put('/jobs/:id', validate(updateJobSchema), ctrl.updateJob);
router.delete('/jobs/:id', validate(idParamSchema), ctrl.deleteJob);

export default router;
