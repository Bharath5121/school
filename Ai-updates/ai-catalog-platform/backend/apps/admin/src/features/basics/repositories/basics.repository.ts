import { prisma } from '../../../config/database';
import type {
  CreateChapterDto, UpdateChapterDto,
  CreateBasicsTopicDto, UpdateBasicsTopicDto,
  CreateBasicsVideoDto, UpdateBasicsVideoDto,
  CreateBasicsArticleDto, UpdateBasicsArticleDto,
  CreateTopicLinkDto, UpdateTopicLinkDto,
} from '../dtos/basics.dto';

export class BasicsRepository {
  // ─── Chapters ─────────────────────────────────────────────

  async findAllChapters() {
    return prisma.basicsChapter.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        icon: true,
        sortOrder: true,
        isPublished: true,
        createdAt: true,
        _count: { select: { topics: true } },
      },
    });
  }

  async findChapterById(id: string) {
    return prisma.basicsChapter.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        icon: true,
        sortOrder: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        topics: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, title: true, slug: true, sortOrder: true, isPublished: true },
        },
      },
    });
  }

  async createChapter(data: CreateChapterDto) {
    return prisma.basicsChapter.create({
      data: data as any,
      select: { id: true, slug: true, title: true, description: true, icon: true, sortOrder: true, isPublished: true, createdAt: true },
    });
  }

  async updateChapter(id: string, data: UpdateChapterDto) {
    return prisma.basicsChapter.update({
      where: { id },
      data: data as any,
      select: { id: true, slug: true, title: true, description: true, icon: true, sortOrder: true, isPublished: true, createdAt: true, updatedAt: true },
    });
  }

  async deleteChapter(id: string) {
    return prisma.basicsChapter.delete({
      where: { id },
      select: { id: true, title: true },
    });
  }

  // ─── Topics ───────────────────────────────────────────────

  async findAllTopics() {
    return prisma.basicsTopic.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        sortOrder: true,
        difficulty: true,
        xp: true,
        chapterId: true,
        isPublished: true,
        createdAt: true,
        chapter: { select: { id: true, title: true } },
        _count: { select: { videos: true, articles: true } },
      },
    });
  }

  async findTopicById(id: string) {
    return prisma.basicsTopic.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        title: true,
        tagline: true,
        description: true,
        icon: true,
        color: true,
        sortOrder: true,
        concepts: true,
        keyTakeaways: true,
        difficulty: true,
        xp: true,
        videoUrl: true,
        videoTitle: true,
        notebookLmUrl: true,
        notebookDescription: true,
        architectureDescription: true,
        architectureDiagramUrl: true,
        isPublished: true,
        chapterId: true,
        createdAt: true,
        updatedAt: true,
        chapter: { select: { id: true, title: true } },
        videos: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, title: true, url: true, channel: true, duration: true, sortOrder: true },
        },
        articles: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, title: true, url: true, source: true, sortOrder: true },
        },
        links: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, type: true, name: true, description: true, redirectUrl: true, sortOrder: true },
        },
      },
    });
  }

  async createTopic(data: CreateBasicsTopicDto) {
    return prisma.basicsTopic.create({
      data: data as any,
      select: {
        id: true, slug: true, title: true, tagline: true, description: true,
        icon: true, color: true, sortOrder: true, difficulty: true, xp: true,
        videoUrl: true, videoTitle: true,
        notebookLmUrl: true, notebookDescription: true,
        architectureDescription: true, architectureDiagramUrl: true,
        isPublished: true, chapterId: true, createdAt: true,
      },
    });
  }

  async updateTopic(id: string, data: UpdateBasicsTopicDto) {
    return prisma.basicsTopic.update({
      where: { id },
      data: data as any,
      select: {
        id: true, slug: true, title: true, tagline: true, description: true,
        icon: true, color: true, sortOrder: true, difficulty: true, xp: true,
        videoUrl: true, videoTitle: true,
        notebookLmUrl: true, notebookDescription: true,
        architectureDescription: true, architectureDiagramUrl: true,
        isPublished: true, chapterId: true, createdAt: true, updatedAt: true,
      },
    });
  }

  async deleteTopic(id: string) {
    return prisma.basicsTopic.delete({
      where: { id },
      select: { id: true, title: true },
    });
  }

  // ─── Videos ───────────────────────────────────────────────

  async createVideo(data: CreateBasicsVideoDto) {
    return prisma.basicsVideo.create({
      data: data as any,
      select: { id: true, title: true, url: true, channel: true, duration: true, sortOrder: true, topicId: true, createdAt: true },
    });
  }

  async updateVideo(id: string, data: UpdateBasicsVideoDto) {
    return prisma.basicsVideo.update({
      where: { id },
      data: data as any,
      select: { id: true, title: true, url: true, channel: true, duration: true, sortOrder: true, topicId: true, createdAt: true },
    });
  }

  async deleteVideo(id: string) {
    return prisma.basicsVideo.delete({
      where: { id },
      select: { id: true, title: true },
    });
  }

  // ─── Articles ─────────────────────────────────────────────

  async createArticle(data: CreateBasicsArticleDto) {
    return prisma.basicsArticle.create({
      data: data as any,
      select: { id: true, title: true, url: true, source: true, sortOrder: true, topicId: true, createdAt: true },
    });
  }

  async updateArticle(id: string, data: UpdateBasicsArticleDto) {
    return prisma.basicsArticle.update({
      where: { id },
      data: data as any,
      select: { id: true, title: true, url: true, source: true, sortOrder: true, topicId: true, createdAt: true },
    });
  }

  async deleteArticle(id: string) {
    return prisma.basicsArticle.delete({
      where: { id },
      select: { id: true, title: true },
    });
  }

  // ─── Topic Links ────────────────────────────────────────────

  async createTopicLink(data: CreateTopicLinkDto) {
    return prisma.basicsTopicLink.create({
      data: data as any,
      select: { id: true, type: true, name: true, description: true, redirectUrl: true, sortOrder: true, topicId: true },
    });
  }

  async updateTopicLink(id: string, data: UpdateTopicLinkDto) {
    return prisma.basicsTopicLink.update({
      where: { id },
      data: data as any,
      select: { id: true, type: true, name: true, description: true, redirectUrl: true, sortOrder: true, topicId: true },
    });
  }

  async deleteTopicLink(id: string) {
    return prisma.basicsTopicLink.delete({
      where: { id },
      select: { id: true, name: true },
    });
  }
}
