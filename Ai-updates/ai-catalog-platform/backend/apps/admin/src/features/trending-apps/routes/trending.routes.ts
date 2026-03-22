import { Router } from 'express';
import { TrendingController } from '../controllers/trending.controller';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { idParamSchema, createCategorySchema, updateCategorySchema, createAppSchema, updateAppSchema } from '../validators/trending.validator';

const router = Router();
const ctrl = new TrendingController();

router.use(authenticate, requireAdmin);

router.get('/categories', ctrl.getCategories);
router.get('/categories/:id', validate(idParamSchema), ctrl.getCategory);
router.post('/categories', validate(createCategorySchema), ctrl.createCategory);
router.put('/categories/:id', validate(updateCategorySchema), ctrl.updateCategory);
router.delete('/categories/:id', validate(idParamSchema), ctrl.deleteCategory);

router.get('/apps', ctrl.getApps);
router.get('/apps/:id', validate(idParamSchema), ctrl.getApp);
router.post('/apps', validate(createAppSchema), ctrl.createApp);
router.put('/apps/:id', validate(updateAppSchema), ctrl.updateApp);
router.delete('/apps/:id', validate(idParamSchema), ctrl.deleteApp);

export default router;
