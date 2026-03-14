import { BasicsRepository } from '../repositories/basics.repository';
import { AppError } from '../../../../shared/errors/AppError';

export class BasicsService {
  private repository = new BasicsRepository();

  async getAllTopics() {
    return this.repository.getAllTopics();
  }

  async getTopicBySlug(slug: string) {
    const topic = await this.repository.getTopicBySlug(slug);
    if (!topic) throw new AppError('Topic not found', 404);
    return topic;
  }

  async getTopicById(id: string) {
    const topic = await this.repository.getTopicById(id);
    if (!topic) throw new AppError('Topic not found', 404);
    return topic;
  }

  async createTopic(data: any) {
    return this.repository.createTopic(data);
  }

  async updateTopic(id: string, data: any) {
    await this.getTopicById(id);
    return this.repository.updateTopic(id, data);
  }

  async deleteTopic(id: string) {
    await this.getTopicById(id);
    return this.repository.deleteTopic(id);
  }

  async createVideo(data: any) {
    return this.repository.createVideo(data);
  }

  async updateVideo(id: string, data: any) {
    return this.repository.updateVideo(id, data);
  }

  async deleteVideo(id: string) {
    return this.repository.deleteVideo(id);
  }

  async createArticle(data: any) {
    return this.repository.createArticle(data);
  }

  async updateArticle(id: string, data: any) {
    return this.repository.updateArticle(id, data);
  }

  async deleteArticle(id: string) {
    return this.repository.deleteArticle(id);
  }
}
