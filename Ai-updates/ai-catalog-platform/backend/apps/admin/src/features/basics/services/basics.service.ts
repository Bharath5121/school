import { BasicsRepository } from '../repositories/basics.repository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { cacheGet, cacheSet, cacheDelPattern } from '../../../shared/utils/cache';
import { BasicsCacheKeys } from '../cache/basics.cache';
import { BASICS_CACHE_TTL } from '../constants/basics.constants';
import type {
  CreateChapterDto, UpdateChapterDto,
  CreateBasicsTopicDto, UpdateBasicsTopicDto,
  CreateBasicsVideoDto, UpdateBasicsVideoDto,
  CreateBasicsArticleDto, UpdateBasicsArticleDto,
  CreateTopicLinkDto, UpdateTopicLinkDto,
} from '../dtos/basics.dto';

export class BasicsService {
  private repo = new BasicsRepository();

  // ─── Chapters ─────────────────────────────────────────────

  async getAllChapters() {
    const cacheKey = BasicsCacheKeys.chapterList();
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const chapters = await this.repo.findAllChapters();
    await cacheSet(cacheKey, chapters, BASICS_CACHE_TTL);
    return chapters;
  }

  async getChapterById(id: string) {
    const cacheKey = BasicsCacheKeys.chapterById(id);
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const chapter = await this.repo.findChapterById(id);
    if (!chapter) throw new NotFoundError('Basics chapter', id);

    await cacheSet(cacheKey, chapter, BASICS_CACHE_TTL);
    return chapter;
  }

  async createChapter(data: CreateChapterDto) {
    const result = await this.repo.createChapter(data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async updateChapter(id: string, data: UpdateChapterDto) {
    await this.getChapterById(id);
    const result = await this.repo.updateChapter(id, data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async deleteChapter(id: string) {
    await this.getChapterById(id);
    const result = await this.repo.deleteChapter(id);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  // ─── Topics ───────────────────────────────────────────────

  async getAllTopics() {
    const cacheKey = BasicsCacheKeys.list();
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const topics = await this.repo.findAllTopics();
    await cacheSet(cacheKey, topics, BASICS_CACHE_TTL);
    return topics;
  }

  async getTopicById(id: string) {
    const cacheKey = BasicsCacheKeys.byId(id);
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const topic = await this.repo.findTopicById(id);
    if (!topic) throw new NotFoundError('Basics topic', id);

    await cacheSet(cacheKey, topic, BASICS_CACHE_TTL);
    return topic;
  }

  async createTopic(data: CreateBasicsTopicDto) {
    const result = await this.repo.createTopic(data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async updateTopic(id: string, data: UpdateBasicsTopicDto) {
    await this.getTopicById(id);
    const result = await this.repo.updateTopic(id, data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async deleteTopic(id: string) {
    await this.getTopicById(id);
    const result = await this.repo.deleteTopic(id);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  // ─── Videos ───────────────────────────────────────────────

  async createVideo(data: CreateBasicsVideoDto) {
    const result = await this.repo.createVideo(data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async updateVideo(id: string, data: UpdateBasicsVideoDto) {
    const result = await this.repo.updateVideo(id, data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async deleteVideo(id: string) {
    const result = await this.repo.deleteVideo(id);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  // ─── Articles ─────────────────────────────────────────────

  async createArticle(data: CreateBasicsArticleDto) {
    const result = await this.repo.createArticle(data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async updateArticle(id: string, data: UpdateBasicsArticleDto) {
    const result = await this.repo.updateArticle(id, data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async deleteArticle(id: string) {
    const result = await this.repo.deleteArticle(id);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  // ─── Topic Links ────────────────────────────────────────────

  async createTopicLink(data: CreateTopicLinkDto) {
    const result = await this.repo.createTopicLink(data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async updateTopicLink(id: string, data: UpdateTopicLinkDto) {
    const result = await this.repo.updateTopicLink(id, data);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }

  async deleteTopicLink(id: string) {
    const result = await this.repo.deleteTopicLink(id);
    await cacheDelPattern(BasicsCacheKeys.pattern());
    return result;
  }
}
