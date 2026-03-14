import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { loggerStream } from './shared/logger/logger';
import { helmetMiddleware } from './middleware/helmet.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { apiLimiter } from './middleware/rate-limiter';
import { errorHandler } from './middleware/error.middleware';

// ── Auth & Onboarding ──
import authRoutes from './features/auth/routes/auth.routes';
import onboardingRoutes from './features/onboarding/routes/onboarding.routes';

// ── Feed ──
import feedRoutes from './features/feed/routes/feed.routes';

// ── Home (public content) ──
import industryRoutes from './features/home/industries/routes/industry.routes';
import detailRoutes from './features/home/industry-detail/routes/detail.routes';
import askAIRoutes from './features/home/ask-ai/routes/askAI.routes';
import basicsRoutes from './features/home/basics/routes/basics.routes';
import adminContentRoutes from './features/home/admin-content/routes/admin.routes';
import exploreRoutes from './features/home/explore/routes/explore.routes';
import guidesRoutes from './features/home/guides/routes/guides.routes';
import careersRoutes from './features/home/careers/routes/careers.routes';
import trendingRoutes from './features/home/trending/routes/trending.routes';

// ── Student ──
import studentDashboardRoutes from './features/student/dashboard/routes/dashboard.routes';
import bookmarkRoutes from './features/student/bookmarks/routes/bookmark.routes';
import historyRoutes from './features/student/history/routes/history.routes';
import skillRoutes from './features/student/skills/routes/skill.routes';
import careerRoutes from './features/student/career/routes/career.routes';
import contentBookmarkRoutes from './features/student/content-bookmarks/routes/content-bookmark.routes';

// ── Notebooks ──
import notebookRoutes from './features/notebooks/routes/notebook.routes';

// ── Chat ──
import chatRoutes from './features/chat/chat.routes';

// ── Teacher / Parent / Admin ──
import teacherDashboardRoutes from './features/teacher/dashboard/routes/dashboard.routes';
import parentDashboardRoutes from './features/parent/dashboard/routes/dashboard.routes';
import parentChildrenRoutes from './features/parent/children/routes/children.routes';
import parentChildActivityRoutes from './features/parent/child-activity/routes/child-activity.routes';
import parentNotificationRoutes from './features/parent/notifications/routes/notification.routes';
import adminDashboardRoutes from './features/admin/dashboard/routes/dashboard.routes';
import adminUsersRoutes from './features/admin/users/routes/users.routes';

const app = express();
app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: loggerStream }));
app.use(apiLimiter);

// ── Auth & Onboarding ──
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);

// ── Feed ──
app.use('/api/feed', feedRoutes);

// ── Home (public content) ──
app.use('/api/home', industryRoutes);
app.use('/api/home', exploreRoutes);
app.use('/api/home', guidesRoutes);
app.use('/api/home', careersRoutes);
app.use('/api/home', trendingRoutes);
app.use('/api/home/industries', detailRoutes);
app.use('/api/home/ask', askAIRoutes);
app.use('/api/home/basics', basicsRoutes);
app.use('/api/home/admin', adminContentRoutes);

// ── Student ──
app.use('/api/student/dashboard', studentDashboardRoutes);
app.use('/api/student/bookmarks', bookmarkRoutes);
app.use('/api/student/history', historyRoutes);
app.use('/api/student/skills', skillRoutes);
app.use('/api/student/career', careerRoutes);
app.use('/api/student/saved-content', contentBookmarkRoutes);

// ── Teacher ──
app.use('/api/teacher/dashboard', teacherDashboardRoutes);

// ── Parent ──
app.use('/api/parent/dashboard', parentDashboardRoutes);
app.use('/api/parent/children', parentChildrenRoutes);
app.use('/api/parent/child', parentChildActivityRoutes);
app.use('/api/parent/notifications', parentNotificationRoutes);

// ── Notebooks ──
app.use('/api/notebooks', notebookRoutes);

// ── Chat ──
app.use('/api/chat', chatRoutes);

// ── Admin ──
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/users', adminUsersRoutes);

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', service: 'ai-catalog-backend' });
});

app.use(errorHandler);

export default app;
