import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { BasicsService } from '../services/basics.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class BasicsController {
  private service = new BasicsService();

  getTopics = asyncHandler(async (_req: Request, res: Response) => {
    const topics = await this.service.getAllTopics();
    res.json(ApiResponse.success(topics, 'Topics fetched'));
  });

  getTopicDetail = asyncHandler(async (req: Request, res: Response) => {
    const topic = await this.service.getTopicBySlug(req.params.slug);
    res.json(ApiResponse.success(topic, 'Topic detail fetched'));
  });
}
