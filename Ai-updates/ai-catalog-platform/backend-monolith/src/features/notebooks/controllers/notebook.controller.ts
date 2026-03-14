import { Request, Response } from 'express';
import { NotebookService } from '../services/notebook.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { isAnythingLLMHealthy } from '../../../lib/anythingllm';

export class NotebookController {
  private service = new NotebookService();

  // ─── Admin: Master Notebooks ───────────────────────────

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAllNotebooks(req.query.industrySlug as string);
    res.json(ApiResponse.success(data));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getNotebookById(req.params.id);
    res.json(ApiResponse.success(data));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createNotebook({
      ...req.body,
      createdBy: req.user!.userId,
    });
    res.status(201).json(ApiResponse.success(result, 'Notebook created'));
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateNotebook(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Notebook updated'));
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteNotebook(req.params.id);
    res.json(ApiResponse.success(null, 'Notebook deleted'));
  });

  publish = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.publishNotebook(req.params.id);
    res.json(ApiResponse.success(result, 'Notebook published'));
  });

  // ─── Admin: Sources ────────────────────────────────────

  addSource = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.addSource(req.params.id, req.body);
    res.status(201).json(ApiResponse.success(result, 'Source added'));
  });

  deleteSource = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteSource(req.params.id, req.params.sourceId);
    res.json(ApiResponse.success(null, 'Source removed'));
  });

  uploadLink = asyncHandler(async (req: Request, res: Response) => {
    const { type, url, title } = req.body;
    const result = await this.service.uploadLinkSource(req.params.id, type, url, title);
    res.status(201).json(ApiResponse.success(result, 'Link uploaded and embedded'));
  });

  uploadFile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json(ApiResponse.error('No file uploaded'));
      return;
    }
    const result = await this.service.uploadFileSource(req.params.id, req.file);
    res.status(201).json(ApiResponse.success(result, 'File uploaded and embedded'));
  });

  // ─── Student: Chat ─────────────────────────────────────

  sendChat = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;
    const result = await this.service.sendChat(
      req.user!.userId,
      req.params.notebookId,
      message,
    );
    res.json(ApiResponse.success(result));
  });

  getChatHistory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getChatHistory(
      req.user!.userId,
      req.params.notebookId,
    );
    res.json(ApiResponse.success(data));
  });

  clearChatHistory = asyncHandler(async (req: Request, res: Response) => {
    await this.service.clearChatHistory(req.user!.userId, req.params.notebookId);
    res.json(ApiResponse.success(null, 'Chat history cleared'));
  });

  // ─── Student: Access ───────────────────────────────────

  getAccess = asyncHandler(async (req: Request, res: Response) => {
    const { industrySlug, category } = req.params;
    const result = await this.service.getNotebookAccess(
      req.user!.userId,
      industrySlug,
      category,
    );
    res.json(ApiResponse.success(result));
  });

  logOpen = asyncHandler(async (req: Request, res: Response) => {
    const { notebookId } = req.body;
    const result = await this.service.logNotebookOpen(req.user!.userId, notebookId);
    res.json(ApiResponse.success(result));
  });

  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAccessHistory(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  getPublishedByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const data = await this.service.getPublishedByCategory(category);
    res.json(ApiResponse.success(data));
  });

  getPublished = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getPublishedNotebooks({
      gradeLevel: req.query.gradeLevel as string,
      difficultyLevel: req.query.difficultyLevel as string,
    });
    res.json(ApiResponse.success(data));
  });

  healthCheck = asyncHandler(async (_req: Request, res: Response) => {
    const healthy = await isAnythingLLMHealthy();
    res.json(ApiResponse.success({ anythingllm: healthy ? 'connected' : 'unreachable' }));
  });
}
