import { Router } from 'express';
import { TopicController } from '../controllers/topic.controller';
import { TopicDetailController } from '../controllers/topic-detail.controller';
import { ChapterController } from '../controllers/chapter.controller';
import { BasicsTopicChatController } from '../controllers/chat.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { topicSlugSchema } from '../validators/basics.validator';

const router = Router();
const topicController = new TopicController();
const topicDetailController = new TopicDetailController();
const chapterController = new ChapterController();
const chatController = new BasicsTopicChatController();

router.get('/chapters', chapterController.getChapters);
router.get('/topics', topicController.getTopics);
router.get('/topics/:slug', validate(topicSlugSchema), topicDetailController.getTopicDetail);
router.get('/topics/:slug/chat', authenticate, validate(topicSlugSchema), chatController.getMessages);
router.post('/topics/:slug/chat', authenticate, validate(topicSlugSchema), chatController.sendMessage);

export default router;
