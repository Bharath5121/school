import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardData, FieldFeeds } from '../types/dashboard.types';

const repo = new DashboardRepository();

export class DashboardAggregatorService {
  async aggregate(userId: string): Promise<DashboardData> {
    const [user, trending, recentFeed] = await Promise.all([
      repo.getUser(userId),
      repo.getTrending(),
      repo.getRecentFeed(),
    ]);

    const interests: string[] = user?.profile?.interests?.map((i: { fieldName: string }) => i.fieldName) ?? [];

    const fieldFeeds: FieldFeeds = {};
    const feedResults = await Promise.all(
      interests.map(async (slug: string) => ({ slug, items: await repo.getFieldFeed(slug) })),
    );
    for (const { slug, items } of feedResults) {
      if (items.length > 0) fieldFeeds[slug] = items;
    }

    const topStory = recentFeed[0] ?? null;

    return {
      user: {
        name: user?.name ?? 'Student',
        interests,
        gradeLevel: user?.profile?.gradeLevel ?? null,
      },
      topStory: topStory
        ? { id: topStory.id, title: topStory.title, field: topStory.fieldSlug, type: topStory.contentType, summary: topStory.summary }
        : null,
      trending: trending.map((t: { id: string; title: string; views: number }) => ({ id: t.id, title: t.title, views: t.views })),
      fieldFeeds,
      recentFeed: recentFeed.map((f: { id: string; title: string; contentType: string; fieldSlug: string }) => ({
        id: f.id,
        title: f.title,
        type: f.contentType,
        field: f.fieldSlug,
      })),
    };
  }
}
