import { ChildActivityRepository } from '../repositories/child-activity.repository';

function getDateSince(timeframe: string): Date | undefined {
  const now = new Date();
  switch (timeframe) {
    case 'today': {
      const d = new Date(now); d.setHours(0, 0, 0, 0); return d;
    }
    case 'week': {
      const d = new Date(now); d.setDate(d.getDate() - 7); return d;
    }
    case 'month': {
      const d = new Date(now); d.setMonth(d.getMonth() - 1); return d;
    }
    default:
      return undefined;
  }
}

export class ChildActivityService {
  private repo = new ChildActivityRepository();

  async getOverview(childId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [profile, allSkills, skillProgress, careerCount, allCareerJobs, timeEntries, recentReading, recentNotebooks, bookmarks] =
      await Promise.all([
        this.repo.getChildProfile(childId),
        this.repo.getAllSkills(),
        this.repo.getSkillProgress(childId),
        this.repo.getCareerExploredCount(childId),
        this.repo.getAllCareerJobs(),
        this.repo.getTimeSpent(childId, weekAgo),
        this.repo.getReadingHistory(childId, weekAgo),
        this.repo.getNotebookAccessLogs(childId, weekAgo),
        this.repo.getContentBookmarks(childId),
      ]);

    const learned = skillProgress.filter((s: any) => s.status === 'LEARNED').length;
    const exploring = skillProgress.filter((s: any) => s.status === 'EXPLORING').length;

    const totalSecondsThisWeek = timeEntries.reduce(
      (sum: number, e: any) => sum + (e.timeSpentSeconds || 0), 0
    );

    return {
      child: {
        id: childId,
        name: profile?.name ?? '',
        gradeLevel: profile?.profile?.gradeLevel ?? null,
        interests: profile?.profile?.interests?.map((i: any) => i.fieldName) ?? [],
      },
      stats: {
        skillsLearned: learned,
        skillsExploring: exploring,
        skillsTotal: allSkills.length,
        careersExplored: careerCount,
        careersTotal: allCareerJobs.length,
        minutesThisWeek: Math.round(totalSecondsThisWeek / 60),
        itemsReadThisWeek: recentReading.length,
        notebooksOpenedThisWeek: recentNotebooks.length,
        savedItems: bookmarks.length,
      },
    };
  }

  async getNotebooks(childId: string, timeframe = 'week') {
    const since = getDateSince(timeframe);
    const notebooks = await this.repo.getNotebookAccessLogs(childId, since);

    const items = notebooks.map((n: any) => ({
      id: n.id,
      title: n.notebook?.title ?? 'Unknown',
      category: n.notebook?.category ?? '',
      industry: n.notebook?.industrySlug ?? '',
      url: n.notebook?.notebookLmUrl ?? null,
      description: n.notebook?.description ?? null,
      accessedAt: n.accessedAt,
    }));

    const byCategory: Record<string, number> = {};
    for (const item of items) {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    }

    const byDay: Record<string, typeof items> = {};
    for (const item of items) {
      const day = new Date(item.accessedAt).toISOString().slice(0, 10);
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(item);
    }

    return {
      total: items.length,
      byCategory,
      byDay,
      items,
    };
  }

  async getActivity(childId: string, timeframe = 'week') {
    const since = getDateSince(timeframe);

    const [reading, notebooks, bookmarks] = await Promise.all([
      this.repo.getReadingHistory(childId, since),
      this.repo.getNotebookAccessLogs(childId, since),
      this.repo.getContentBookmarks(childId),
    ]);

    const readingItems = reading.map((r: any) => ({
      type: 'READING' as const,
      title: r.feedItem?.title ?? 'Unknown',
      contentType: r.feedItem?.contentType ?? '',
      field: r.feedItem?.fieldSlug ?? '',
      timeSpent: r.timeSpentSeconds,
      completed: r.completed,
      date: r.lastReadAt,
    }));

    const notebookItems = notebooks.map((n: any) => ({
      type: 'NOTEBOOK' as const,
      title: n.notebook?.title ?? 'Unknown',
      category: n.notebook?.category ?? '',
      industry: n.notebook?.industrySlug ?? '',
      url: n.notebook?.notebookLmUrl ?? null,
      date: n.accessedAt,
    }));

    const savedItems = bookmarks.slice(0, 20).map((b: any) => ({
      type: 'SAVED' as const,
      title: b.title,
      contentType: b.contentType,
      date: b.createdAt,
    }));

    const feed = [...readingItems, ...notebookItems, ...savedItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { feed, counts: { reading: readingItems.length, notebooks: notebookItems.length, saved: savedItems.length } };
  }

  async getSkills(childId: string) {
    const [allSkills, progress] = await Promise.all([
      this.repo.getAllSkills(),
      this.repo.getSkillProgress(childId),
    ]);

    const progressMap = new Map<string, any>(
      progress.map((p: any) => [p.skillId, p])
    );

    const items = allSkills.map((skill: any) => {
      const p = progressMap.get(skill.id);
      return {
        id: skill.id,
        name: skill.name,
        level: skill.level ?? 'BEGINNER',
        category: skill.category ?? '',
        industry: skill.industrySlug ?? '',
        status: p?.status ?? 'NOT_STARTED',
        updatedAt: p?.updatedAt ?? null,
      };
    });

    const learned = items.filter((i: any) => i.status === 'LEARNED').length;
    const exploring = items.filter((i: any) => i.status === 'EXPLORING').length;
    const notStarted = items.filter((i: any) => i.status === 'NOT_STARTED').length;

    return {
      items,
      summary: { total: items.length, learned, exploring, notStarted },
    };
  }

  async getCareer(childId: string) {
    const [allJobs, explored] = await Promise.all([
      this.repo.getAllCareerJobs(),
      this.repo.getCareerExplored(childId),
    ]);

    const exploredMap = new Map<string, any>(
      explored.map((e: any) => [e.careerJobId, e])
    );

    return allJobs.map((job: any) => {
      const e = exploredMap.get(job.id);
      return {
        id: job.id,
        title: job.title,
        pathTitle: job.careerPath?.title ?? '',
        industry: job.careerPath?.industrySlug ?? '',
        demand: job.demand ?? 'STABLE',
        explored: !!e,
        exploredAt: e?.exploredAt ?? null,
      };
    });
  }

  async getTimeSpent(childId: string, timeframe = 'week') {
    const since = getDateSince(timeframe);
    const entries = await this.repo.getTimeSpent(childId, since);

    const dailyMap = new Map<string, number>();
    for (const e of entries) {
      const day = new Date(e.lastReadAt).toISOString().slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) || 0) + (e.timeSpentSeconds || 0));
    }

    const daily = Array.from(dailyMap.entries())
      .map(([date, seconds]) => ({ date, minutes: Math.round(seconds / 60) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalMinutes = daily.reduce((sum, d) => sum + d.minutes, 0);

    return { daily, totalMinutes };
  }

  async getCompleted(childId: string) {
    const [completedReading, skillProgress] = await Promise.all([
      this.repo.getCompletedReading(childId),
      this.repo.getSkillProgress(childId),
    ]);

    const learnedSkills = skillProgress.filter((s: any) => s.status === 'LEARNED');
    const learnedSkillIds = learnedSkills.map((s: any) => s.skillId);
    const skillDetails = learnedSkillIds.length > 0
      ? await this.repo.getSkillsByIds(learnedSkillIds) : [];

    return {
      completedReading: completedReading.map((r: any) => ({
        id: r.feedItem?.id,
        title: r.feedItem?.title ?? 'Unknown',
        type: r.feedItem?.contentType,
        field: r.feedItem?.fieldSlug,
        completedAt: r.lastReadAt,
      })),
      learnedSkills: skillDetails.map((s: any) => ({
        id: s.id,
        name: s.name,
        level: s.level,
        category: s.category,
        industry: s.industrySlug,
      })),
    };
  }

  async getStudentDashboard(childId: string) {
    return this.repo.getStudentDashboardData(childId);
  }

  async getChildInterests(childId: string) {
    const profile = await this.repo.getChildProfile(childId);
    return profile?.profile?.interests?.map((i: any) => i.fieldName) ?? [];
  }

  async getChildSkillProgress(childId: string) {
    const progress = await this.repo.getSkillProgress(childId);
    return progress.map((p: any) => ({ skillId: p.skillId, status: p.status }));
  }

  async getChildCareerStats(childId: string) {
    const explored = await this.repo.getCareerExplored(childId);
    const jobIds = explored.map((e: any) => e.careerJobId);
    return { jobIds, count: jobIds.length };
  }
}
