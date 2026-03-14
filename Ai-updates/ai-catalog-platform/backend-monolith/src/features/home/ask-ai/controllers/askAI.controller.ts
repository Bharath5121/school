import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { AskAIService } from '../services/askAI.service';
import { QuestionsRepository } from '../repositories/questions.repository';
import { ApiResponse } from '../../../../shared/response/ApiResponse';
import { logger } from '../../../../shared/logger/logger';

export class AskAIController {
  private service = new AskAIService();
  private questionsRepo = new QuestionsRepository();

  getPredefinedQuestions = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.questionsRepo.getByIndustry(req.params.slug);
    res.status(200).json(ApiResponse.success(result));
  });

  askQuestion = async (req: Request, res: Response) => {
    const { question, fieldSlug } = req.body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await this.service.streamResponse(question, fieldSlug, res);
    } catch (e) {
      logger.error('AskAI stream error', e);
      if (!res.headersSent) {
        res.status(500).json(ApiResponse.error('Error streaming response'));
      } else {
        res.end();
      }
    }
  };
}
