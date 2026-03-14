import { prisma } from '../../../../config/database';

export class TrendingRepository {
  async getTrending(timeframe: string, limit: number, type?: string) {
    const now = new Date();
    let since: Date;

    switch (timeframe) {
      case 'today':
        since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        since = new Date(now.getTime() - 7 * 86400000);
        break;
      case 'month':
        since = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const includeIndustry = { industry: { select: { name: true, slug: true, icon: true, color: true } } };

    const fetchItems = async (dateFilter: boolean) => {
      const where = dateFilter
        ? { isPublished: true, createdAt: { gte: since } }
        : { isPublished: true };

      const [modelsRaw, agentsRaw, appsRaw] = await Promise.all([
        (!type || type === 'MODEL') ? prisma.aIModel.findMany({
          where, include: includeIndustry,
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          take: limit,
        }) : Promise.resolve([]),
        (!type || type === 'AGENT') ? prisma.aIAgent.findMany({
          where, include: includeIndustry,
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          take: limit,
        }) : Promise.resolve([]),
        (!type || type === 'APP') ? prisma.aIApp.findMany({
          where, include: includeIndustry,
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          take: limit,
        }) : Promise.resolve([]),
      ]);
      return { models: modelsRaw as any[], agents: agentsRaw as any[], apps: appsRaw as any[] };
    };

    let { models, agents, apps } = await fetchItems(true);

    if (models.length === 0 && agents.length === 0 && apps.length === 0) {
      ({ models, agents, apps } = await fetchItems(false));
    }

    type TrendingItem = {
      id: string;
      title: string;
      type: string;
      field: string;
      fieldSlug: string;
      fieldIcon: string;
      careerImpact: string;
      tryUrl?: string;
      notebookLmUrl?: string;
      builtBy?: string;
      builtByRole?: string;
      description?: string;
      createdAt: Date;
    };

    const items: TrendingItem[] = [
      ...models.map((m: any) => ({ id: m.id, title: m.name, type: 'MODEL', field: m.industry.name, fieldSlug: m.industry.slug, fieldIcon: m.industry.icon, careerImpact: 'HIGH', tryUrl: m.tryUrl || undefined, notebookLmUrl: m.notebookLmUrl || undefined, builtBy: m.builtBy, description: m.description, createdAt: m.createdAt })),
      ...agents.map((a: any) => ({ id: a.id, title: a.name, type: 'AGENT', field: a.industry.name, fieldSlug: a.industry.slug, fieldIcon: a.industry.icon, careerImpact: 'HIGH', tryUrl: a.tryUrl || undefined, notebookLmUrl: a.notebookLmUrl || undefined, builtBy: a.builtBy, description: a.description, createdAt: a.createdAt })),
      ...apps.map((a: any) => ({ id: a.id, title: a.name, type: 'APP', field: a.industry.name, fieldSlug: a.industry.slug, fieldIcon: a.industry.icon, careerImpact: 'MEDIUM', tryUrl: a.tryUrl || undefined, builtBy: a.builtBy, builtByRole: a.builtByRole || undefined, description: a.description, createdAt: a.createdAt })),
    ];

    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return items.slice(0, limit);
  }

  async getWhatsNew(fieldSlugs?: string[], contentType?: string, showAll = false) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

    const fieldFilter = showAll || !fieldSlugs?.length
      ? undefined
      : { in: fieldSlugs };

    const [models, agents, apps, guides] = await Promise.all([
      (!contentType || contentType === 'models') ? prisma.aIModel.findMany({
        where: { isPublished: true, createdAt: { gte: sevenDaysAgo }, ...(fieldFilter && { industrySlug: fieldFilter }) },
        include: { industry: { select: { name: true, slug: true, icon: true } } },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: 10,
      }) : Promise.resolve([]),
      (!contentType || contentType === 'agents') ? prisma.aIAgent.findMany({
        where: { isPublished: true, createdAt: { gte: sevenDaysAgo }, ...(fieldFilter && { industrySlug: fieldFilter }) },
        include: { industry: { select: { name: true, slug: true, icon: true } } },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: 10,
      }) : Promise.resolve([]),
      (!contentType || contentType === 'apps') ? prisma.aIApp.findMany({
        where: { isPublished: true, createdAt: { gte: sevenDaysAgo }, ...(fieldFilter && { industrySlug: fieldFilter }) },
        include: { industry: { select: { name: true, slug: true, icon: true } } },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: 10,
      }) : Promise.resolve([]),
      (!contentType || contentType === 'guides') ? prisma.guide.findMany({
        where: { isPublished: true, createdAt: { gte: sevenDaysAgo }, ...(fieldFilter && { industrySlug: fieldFilter }) },
        include: { industry: { select: { name: true, slug: true, icon: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }) : Promise.resolve([]),
    ]);

    return { models, agents, apps, guides, lastUpdated: new Date().toISOString() };
  }
}
