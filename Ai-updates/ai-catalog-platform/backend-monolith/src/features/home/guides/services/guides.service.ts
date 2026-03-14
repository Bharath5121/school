import { GuidesRepository } from '../repositories/guides.repository';
import { AppError } from '../../../../shared/errors/AppError';

const repo = new GuidesRepository();

export class GuidesService {
  async listGuides(industrySlug?: string, difficulty?: string, search?: string, page = 1, limit = 20) {
    return repo.findGuides(industrySlug, difficulty, search, page, limit);
  }

  async getGuide(id: string) {
    const guide = await repo.findGuideById(id);
    if (!guide) throw new AppError('Guide not found', 404);
    return guide;
  }

  async listPrompts(industrySlug?: string, category?: string, page = 1, limit = 20) {
    return repo.findPrompts(industrySlug, category, page, limit);
  }
}
