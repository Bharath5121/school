import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { TopicService } from '../services/topic.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class TopicController {
  private service = new TopicService();

  getTopics = asyncHandler(async (_req: Request, res: Response) => {
    const topics = await this.service.getAllTopics();
    res.json(ApiResponse.success(topics, 'Topics fetched'));
  });
}
