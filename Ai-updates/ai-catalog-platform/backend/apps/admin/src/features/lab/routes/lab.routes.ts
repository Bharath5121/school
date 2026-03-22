import { Router } from 'express';
import { LabController } from '../controllers/lab.controller';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { idParamSchema, createCategorySchema, updateCategorySchema, createItemSchema, updateItemSchema } from '../validators/lab.validator';

const router = Router();
const ctrl = new LabController();

router.use(authenticate, requireAdmin);

router.get('/categories', ctrl.getCategories);
router.get('/categories/:id', validate(idParamSchema), ctrl.getCategory);
router.post('/categories', validate(createCategorySchema), ctrl.createCategory);
router.put('/categories/:id', validate(updateCategorySchema), ctrl.updateCategory);
router.delete('/categories/:id', validate(idParamSchema), ctrl.deleteCategory);

router.get('/items', ctrl.getItems);
router.get('/items/:id', validate(idParamSchema), ctrl.getItem);
router.post('/items', validate(createItemSchema), ctrl.createItem);
router.put('/items/:id', validate(updateItemSchema), ctrl.updateItem);
router.delete('/items/:id', validate(idParamSchema), ctrl.deleteItem);

export default router;
