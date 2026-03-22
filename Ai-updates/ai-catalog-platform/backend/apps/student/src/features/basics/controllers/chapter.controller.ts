import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ChapterService } from '../services/chapter.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class ChapterController {
  private service = new ChapterService();

  getChapters = asyncHandler(async (_req: Request, res: Response) => {
    const chapters = await this.service.getChaptersWithTopics();
    res.json(ApiResponse.success(chapters, 'Chapters fetched'));
  });
}
