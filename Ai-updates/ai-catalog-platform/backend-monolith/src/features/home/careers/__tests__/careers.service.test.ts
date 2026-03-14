import { CareersService } from '../services/careers.service';
import { CareersRepository } from '../repositories/careers.repository';
import { AppError } from '../../../../shared/errors/AppError';

jest.mock('../repositories/careers.repository');

const mockRepo = CareersRepository.prototype as jest.Mocked<CareersRepository>;

describe('CareersService', () => {
  let service: CareersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CareersService();
  });

  describe('getCareerPaths', () => {
    it('should return career paths for a valid industry', async () => {
      const paths = [
        { id: 'cp1', title: 'Data Scientist', industrySlug: 'healthcare', jobs: [] },
        { id: 'cp2', title: 'ML Engineer', industrySlug: 'healthcare', jobs: [] },
      ];
      mockRepo.getCareerPaths.mockResolvedValue(paths as any);

      const result = await service.getCareerPaths('healthcare');

      expect(result).toEqual(paths);
      expect(mockRepo.getCareerPaths).toHaveBeenCalledWith('healthcare');
    });

    it('should throw 404 when no career paths found', async () => {
      mockRepo.getCareerPaths.mockResolvedValue([]);

      await expect(service.getCareerPaths('unknown-industry')).rejects.toThrow(AppError);
      await expect(service.getCareerPaths('unknown-industry')).rejects.toMatchObject({
        message: 'No career paths found for this industry',
        statusCode: 404,
      });
    });
  });

  describe('getJobs', () => {
    it('should return jobs for a given industry', async () => {
      const jobs = [
        { id: 'j1', title: 'AI Researcher', careerPath: { title: 'Research', industrySlug: 'healthcare' } },
        { id: 'j2', title: 'Data Analyst', careerPath: { title: 'Analytics', industrySlug: 'healthcare' } },
      ];
      mockRepo.getJobs.mockResolvedValue(jobs as any);

      const result = await service.getJobs('healthcare');

      expect(result).toEqual(jobs);
      expect(mockRepo.getJobs).toHaveBeenCalledWith('healthcare');
    });

    it('should return empty array when no jobs exist', async () => {
      mockRepo.getJobs.mockResolvedValue([]);

      const result = await service.getJobs('empty-industry');

      expect(result).toEqual([]);
    });
  });

  describe('getJobById', () => {
    it('should return a job when found', async () => {
      const job = {
        id: 'j1',
        title: 'AI Researcher',
        careerPath: { title: 'Research', industrySlug: 'healthcare', industry: { name: 'Healthcare', icon: '🏥' } },
      };
      mockRepo.getJobById.mockResolvedValue(job as any);

      const result = await service.getJobById('j1');

      expect(result).toEqual(job);
      expect(mockRepo.getJobById).toHaveBeenCalledWith('j1');
    });

    it('should throw 404 when job not found', async () => {
      mockRepo.getJobById.mockResolvedValue(null);

      await expect(service.getJobById('non-existent')).rejects.toThrow(AppError);
      await expect(service.getJobById('non-existent')).rejects.toMatchObject({
        message: 'Career job not found',
        statusCode: 404,
      });
    });
  });

  describe('getSkills', () => {
    it('should return skills for a given industry', async () => {
      const skills = [
        { id: 's1', name: 'Python', level: 'BEGINNER', industrySlug: 'healthcare' },
        { id: 's2', name: 'TensorFlow', level: 'INTERMEDIATE', industrySlug: 'healthcare' },
      ];
      mockRepo.getSkills.mockResolvedValue(skills as any);

      const result = await service.getSkills('healthcare');

      expect(result).toEqual(skills);
      expect(mockRepo.getSkills).toHaveBeenCalledWith('healthcare');
    });

    it('should return empty array when no skills exist', async () => {
      mockRepo.getSkills.mockResolvedValue([]);

      const result = await service.getSkills('new-industry');

      expect(result).toEqual([]);
    });
  });
});
