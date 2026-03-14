import { prisma } from '../../../../config/database';

export class BasicsRepository {
  async getAllTopics() {
    return prisma.basicsTopic.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        tagline: true,
        icon: true,
        color: true,
        sortOrder: true,
      },
    });
  }

  async getTopicBySlug(slug: string) {
    return prisma.basicsTopic.findUnique({
      where: { slug },
      include: {
        videos: { orderBy: { sortOrder: 'asc' } },
        articles: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async getTopicById(id: string) {
    return prisma.basicsTopic.findUnique({
      where: { id },
      include: {
        videos: { orderBy: { sortOrder: 'asc' } },
        articles: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async createTopic(data: any) {
    const { videos, articles, ...topicData } = data;
    return prisma.basicsTopic.create({
      data: {
        ...topicData,
        videos: videos ? { create: videos } : undefined,
        articles: articles ? { create: articles } : undefined,
      },
      include: { videos: true, articles: true },
    });
  }

  async updateTopic(id: string, data: any) {
    const { videos, articles, ...topicData } = data;
    return prisma.basicsTopic.update({
      where: { id },
      data: topicData,
      include: { videos: true, articles: true },
    });
  }

  async deleteTopic(id: string) {
    return prisma.basicsTopic.delete({ where: { id } });
  }

  async createVideo(data: any) {
    return prisma.basicsVideo.create({ data });
  }

  async updateVideo(id: string, data: any) {
    return prisma.basicsVideo.update({ where: { id }, data });
  }

  async deleteVideo(id: string) {
    return prisma.basicsVideo.delete({ where: { id } });
  }

  async createArticle(data: any) {
    return prisma.basicsArticle.create({ data });
  }

  async updateArticle(id: string, data: any) {
    return prisma.basicsArticle.update({ where: { id }, data });
  }

  async deleteArticle(id: string) {
    return prisma.basicsArticle.delete({ where: { id } });
  }

  async countTopics() {
    return prisma.basicsTopic.count();
  }

  async countVideos() {
    return prisma.basicsVideo.count();
  }

  async countArticles() {
    return prisma.basicsArticle.count();
  }
}
