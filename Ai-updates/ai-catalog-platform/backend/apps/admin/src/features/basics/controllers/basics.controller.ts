import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { BasicsService } from '../services/basics.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class BasicsController {
  private service = new BasicsService();

  // ─── Chapters ─────────────────────────────────────────────

  getChapters = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllChapters();
    res.json(ApiResponse.success(data));
  });

  getChapter = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getChapterById(req.params.id);
    res.json(ApiResponse.success(data));
  });

  createChapter = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createChapter(req.body);
    res.status(201).json(ApiResponse.success(result, 'Chapter created'));
  });

  updateChapter = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateChapter(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Chapter updated'));
  });

  deleteChapter = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteChapter(req.params.id);
    res.json(ApiResponse.success(null, 'Chapter deleted'));
  });

  // ─── Topics ───────────────────────────────────────────────

  getTopics = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllTopics();
    res.json(ApiResponse.success(data));
  });

  getTopic = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getTopicById(req.params.id);
    res.json(ApiResponse.success(data));
  });

  createTopic = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createTopic(req.body);
    res.status(201).json(ApiResponse.success(result, 'Basics topic created'));
  });

  updateTopic = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateTopic(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Basics topic updated'));
  });

  deleteTopic = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteTopic(req.params.id);
    res.json(ApiResponse.success(null, 'Basics topic deleted'));
  });

  // ─── Videos ───────────────────────────────────────────────

  createVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createVideo(req.body);
    res.status(201).json(ApiResponse.success(result, 'Video added'));
  });

  updateVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateVideo(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Video updated'));
  });

  deleteVideo = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteVideo(req.params.id);
    res.json(ApiResponse.success(null, 'Video deleted'));
  });

  // ─── Articles ─────────────────────────────────────────────

  createArticle = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createArticle(req.body);
    res.status(201).json(ApiResponse.success(result, 'Article added'));
  });

  updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateArticle(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Article updated'));
  });

  deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteArticle(req.params.id);
    res.json(ApiResponse.success(null, 'Article deleted'));
  });

  // ─── Topic Links ────────────────────────────────────────────

  createTopicLink = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createTopicLink(req.body);
    res.status(201).json(ApiResponse.success(result, 'Link added'));
  });

  updateTopicLink = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateTopicLink(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Link updated'));
  });

  deleteTopicLink = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteTopicLink(req.params.id);
    res.json(ApiResponse.success(null, 'Link deleted'));
  });
}
