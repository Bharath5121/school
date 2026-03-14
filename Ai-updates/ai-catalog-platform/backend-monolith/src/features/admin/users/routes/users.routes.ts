import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate, requireAdmin } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import { userIdParamSchema, updateRoleSchema, listUsersSchema } from '../validators/users.validator';

const router = Router();
const ctrl = new UsersController();

router.use(authenticate, requireAdmin);

router.get('/', validate(listUsersSchema), ctrl.listUsers);
router.get('/:id', validate(userIdParamSchema), ctrl.getUser);
router.put('/:id/role', validate(updateRoleSchema), ctrl.updateRole);
router.delete('/:id', validate(userIdParamSchema), ctrl.deleteUser);

export default router;
