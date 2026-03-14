import { ExploreService } from '../services/explore.service';
import { ExploreRepository } from '../repositories/explore.repository';
import { AppError } from '../../../../shared/errors/AppError';

jest.mock('../repositories/explore.repository');

const mockRepo = ExploreRepository.prototype as jest.Mocked<ExploreRepository>;

describe('ExploreService', () => {
  let service: ExploreService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ExploreService();
  });

  describe('getModels', () => {
    it('should return paginated model results', async () => {
      const data = {
        items: [{ id: 'm1', name: 'GPT-4', builtBy: 'OpenAI' }],
        total: 1,
      };
      mockRepo.getModels.mockResolvedValue(data as any);

      const filters = { industrySlug: 'healthcare' };
      const result = await service.getModels(filters, 1, 10);

      expect(result).toEqual(data);
      expect(mockRepo.getModels).toHaveBeenCalledWith(filters, { page: 1, limit: 10 });
    });

    it('should pass through empty filters', async () => {
      const data = { items: [], total: 0 };
      mockRepo.getModels.mockResolvedValue(data as any);

      const result = await service.getModels({}, 1, 20);

      expect(result).toEqual(data);
      expect(mockRepo.getModels).toHaveBeenCalledWith({}, { page: 1, limit: 20 });
    });
  });

  describe('getModelById', () => {
    it('should return a model when found', async () => {
      const model = { id: 'm1', name: 'GPT-4', builtBy: 'OpenAI' };
      mockRepo.getModelById.mockResolvedValue(model as any);

      const result = await service.getModelById('m1');

      expect(result).toEqual(model);
      expect(mockRepo.getModelById).toHaveBeenCalledWith('m1');
    });

    it('should throw 404 when model not found', async () => {
      mockRepo.getModelById.mockResolvedValue(null);

      await expect(service.getModelById('non-existent')).rejects.toThrow(AppError);
      await expect(service.getModelById('non-existent')).rejects.toMatchObject({
        message: 'Model not found',
        statusCode: 404,
      });
    });
  });

  describe('getAgents', () => {
    it('should return paginated agent results', async () => {
      const data = {
        items: [{ id: 'a1', name: 'CodeAgent', builtBy: 'Anthropic' }],
        total: 1,
      };
      mockRepo.getAgents.mockResolvedValue(data as any);

      const filters = { industrySlug: 'tech' };
      const result = await service.getAgents(filters, 2, 5);

      expect(result).toEqual(data);
      expect(mockRepo.getAgents).toHaveBeenCalledWith(filters, { page: 2, limit: 5 });
    });
  });

  describe('getApps', () => {
    it('should return paginated app results', async () => {
      const data = {
        items: [{ id: 'app1', name: 'ChatBot', isFree: true }],
        total: 1,
      };
      mockRepo.getApps.mockResolvedValue(data as any);

      const filters = { isFree: true };
      const result = await service.getApps(filters, 1, 10);

      expect(result).toEqual(data);
      expect(mockRepo.getApps).toHaveBeenCalledWith(filters, { page: 1, limit: 10 });
    });
  });

});
