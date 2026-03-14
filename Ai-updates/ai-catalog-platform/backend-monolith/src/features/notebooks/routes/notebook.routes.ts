import { Router } from 'express';
import multer from 'multer';
import { NotebookController } from '../controllers/notebook.controller';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import {
  idParamSchema,
  createNotebookSchema,
  updateNotebookSchema,
  addSourceSchema,
  deleteSourceSchema,
  studentAccessSchema,
  industrySlugQuerySchema,
  chatMessageSchema,
  chatHistorySchema,
  uploadLinkSchema,
} from '../validators/notebook.validators';

const router = Router();
const ctrl = new NotebookController();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// ─── Health ──────────────────────────────────────────────
router.get('/health', ctrl.healthCheck);

// ─── Admin Routes ────────────────────────────────────────
const admin = Router();
admin.use(authenticate, requireAdmin);

admin.get('/', validate(industrySlugQuerySchema), ctrl.getAll);
admin.get('/:id', validate(idParamSchema), ctrl.getById);
admin.post('/', validate(createNotebookSchema), ctrl.create);
admin.put('/:id', validate(updateNotebookSchema), ctrl.update);
admin.delete('/:id', validate(idParamSchema), ctrl.remove);
admin.post('/:id/publish', validate(idParamSchema), ctrl.publish);
admin.post('/:id/sources', validate(addSourceSchema), ctrl.addSource);
admin.delete('/:id/sources/:sourceId', validate(deleteSourceSchema), ctrl.deleteSource);
admin.post('/:id/sources/upload-link', validate(uploadLinkSchema), ctrl.uploadLink);
admin.post('/:id/sources/upload-file', upload.single('file'), ctrl.uploadFile);

router.use('/admin', admin);

// ─── Student: Chat ───────────────────────────────────────
router.post('/:notebookId/chat', authenticate, validate(chatMessageSchema), ctrl.sendChat);
router.get('/:notebookId/chat-history', authenticate, validate(chatHistorySchema), ctrl.getChatHistory);
router.delete('/:notebookId/chat-history', authenticate, validate(chatHistorySchema), ctrl.clearChatHistory);

// ─── Student: Browse & Access ────────────────────────────
router.get('/my-history', authenticate, ctrl.getHistory);
router.post('/log-open', authenticate, ctrl.logOpen);
router.get('/published', ctrl.getPublished);
router.get('/published/:category', ctrl.getPublishedByCategory);
router.get('/:industrySlug/:category', authenticate, validate(studentAccessSchema), ctrl.getAccess);

export default router;
