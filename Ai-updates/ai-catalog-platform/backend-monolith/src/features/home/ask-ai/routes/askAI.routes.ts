import { Router } from 'express';
import { AskAIController } from '../controllers/askAI.controller';
import { askAiLimiter } from '../../../../middleware/rate-limiter';
import { validate } from '../../../../shared/utils/validate';
import { askQuestionSchema, getQuestionsSchema } from '../validators/askAI.validator';

const router = Router();
const controller = new AskAIController();

router.get('/questions/:slug', validate(getQuestionsSchema), controller.getPredefinedQuestions);
router.post('/', askAiLimiter, validate(askQuestionSchema), controller.askQuestion);

export default router;
