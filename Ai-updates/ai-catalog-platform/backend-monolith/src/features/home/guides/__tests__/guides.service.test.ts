import { GuidesService } from '../services/guides.service';
import { GuidesRepository } from '../repositories/guides.repository';
import { AppError } from '../../../../shared/errors/AppError';

jest.mock('../repositories/guides.repository');

const mockRepo = GuidesRepository.prototype as jest.Mocked<GuidesRepository>;

describe('GuidesService', () => {
  let service: GuidesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GuidesService();
  });

  describe('listGuides', () => {
    it('should return a paginated list of guides', async () => {
      const data = {
        items: [
          { id: 'g1', title: 'Intro to AI', difficulty: 'BEGINNER' },
          { id: 'g2', title: 'Advanced ML', difficulty: 'ADVANCED' },
        ],
        total: 2,
      };
      mockRepo.findGuides.mockResolvedValue(data as any);

      const result = await service.listGuides('healthcare', 'BEGINNER', undefined, 1, 20);

      expect(result).toEqual(data);
      expect(mockRepo.findGuides).toHaveBeenCalledWith('healthcare', 'BEGINNER', undefined, 1, 20);
    });

    it('should use default pagination values', async () => {
      const data = { items: [], total: 0 };
      mockRepo.findGuides.mockResolvedValue(data as any);

      const result = await service.listGuides();

      expect(result).toEqual(data);
      expect(mockRepo.findGuides).toHaveBeenCalledWith(undefined, undefined, undefined, 1, 20);
    });

    it('should pass search parameter through', async () => {
      const data = { items: [{ id: 'g1', title: 'AI Guide' }], total: 1 };
      mockRepo.findGuides.mockResolvedValue(data as any);

      await service.listGuides(undefined, undefined, 'AI', 2, 10);

      expect(mockRepo.findGuides).toHaveBeenCalledWith(undefined, undefined, 'AI', 2, 10);
    });
  });

  describe('getGuide', () => {
    it('should return a guide when found', async () => {
      const guide = { id: 'g1', title: 'Intro to AI', difficulty: 'BEGINNER', content: 'Guide content...' };
      mockRepo.findGuideById.mockResolvedValue(guide as any);

      const result = await service.getGuide('g1');

      expect(result).toEqual(guide);
      expect(mockRepo.findGuideById).toHaveBeenCalledWith('g1');
    });

    it('should throw 404 when guide not found', async () => {
      mockRepo.findGuideById.mockResolvedValue(null);

      await expect(service.getGuide('non-existent')).rejects.toThrow(AppError);
      await expect(service.getGuide('non-existent')).rejects.toMatchObject({
        message: 'Guide not found',
        statusCode: 404,
      });
    });
  });

  describe('listPrompts', () => {
    it('should return a paginated list of prompts', async () => {
      const data = {
        items: [
          { id: 'p1', title: 'Summarize article', category: 'research' },
          { id: 'p2', title: 'Generate code', category: 'coding' },
        ],
        total: 2,
      };
      mockRepo.findPrompts.mockResolvedValue(data as any);

      const result = await service.listPrompts('healthcare', 'research', 1, 20);

      expect(result).toEqual(data);
      expect(mockRepo.findPrompts).toHaveBeenCalledWith('healthcare', 'research', 1, 20);
    });

    it('should use default pagination values', async () => {
      const data = { items: [], total: 0 };
      mockRepo.findPrompts.mockResolvedValue(data as any);

      const result = await service.listPrompts();

      expect(result).toEqual(data);
      expect(mockRepo.findPrompts).toHaveBeenCalledWith(undefined, undefined, 1, 20);
    });
  });
});
