import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { TopicDetailService } from '../services/topic-detail.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class TopicDetailController {
  private service = new TopicDetailService();

  getTopicDetail = asyncHandler(async (req: Request, res: Response) => {
    const topic = await this.service.getTopicBySlug(req.params.slug);
    res.json(ApiResponse.success(topic, 'Topic detail fetched'));
  });
}
