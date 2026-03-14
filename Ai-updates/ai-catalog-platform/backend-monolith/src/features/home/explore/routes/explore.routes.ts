import { Router } from 'express';
import { ExploreController } from '../controllers/explore.controller';
import { validate } from '../../../../shared/utils/validate';
import {
  listModelsSchema,
  listAgentsSchema,
  listAppsSchema,
  idParamSchema,
} from '../validators/explore.validator';

const router = Router();

router.get('/models', validate(listModelsSchema), ExploreController.getModels);
router.get('/models/:id', validate(idParamSchema), ExploreController.getModelById);
router.get('/agents', validate(listAgentsSchema), ExploreController.getAgents);
router.get('/agents/:id', validate(idParamSchema), ExploreController.getAgentById);
router.get('/apps', validate(listAppsSchema), ExploreController.getApps);

export default router;
