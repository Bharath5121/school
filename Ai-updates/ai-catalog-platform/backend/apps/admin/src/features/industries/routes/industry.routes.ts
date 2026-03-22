import { Router } from 'express';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { industryController } from '../controllers/industry.controller';
import { industryAdminController } from '../controllers/industry-admin.controller';
import { idParamSchema, createIndustrySchema, updateIndustrySchema } from '../validators/industry-admin.validator';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/', industryController.getAll);
router.get('/:id', validate(idParamSchema), industryController.getById);
router.post('/', validate(createIndustrySchema), industryAdminController.create);
router.put('/:id', validate(updateIndustrySchema), industryAdminController.update);
router.delete('/:id', validate(idParamSchema), industryAdminController.delete);

export default router;
