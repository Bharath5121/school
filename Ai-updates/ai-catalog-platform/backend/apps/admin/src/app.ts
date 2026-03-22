import express from 'express';
import cookieParser from 'cookie-parser';
import { helmetMiddleware } from './middleware/helmet.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { apiLimiter } from './middleware/rate-limiter';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { requestLoggerMiddleware } from './middleware/request-logger.middleware';
import { sanitizeMiddleware } from './middleware/sanitize.middleware';
import { errorHandler } from './middleware/error.middleware';
import { morganMiddleware } from './shared/logger/morgan.config';

import dashboardRoutes from './features/dashboard/routes/dashboard.routes';
import industryRoutes from './features/industries/routes/industry.routes';
import basicsRoutes from './features/basics/routes/basics.routes';
import discoveryRoutes from './features/discoveries/routes/discovery.routes';
import labRoutes from './features/lab/routes/lab.routes';
import trendingRoutes from './features/trending-apps/routes/trending.routes';
import careerRoutes from './features/career-map/routes/career.routes';
import careerGuideRoutes from './features/career-guide/routes/career-guide.routes';
import skillsRoutes from './features/skills/routes/skills.routes';
import userRoutes from './features/users/routes/users.routes';

const app = express();
app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morganMiddleware);
app.use(apiLimiter);
app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);
app.use(sanitizeMiddleware);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/basics', basicsRoutes);
app.use('/api/discoveries', discoveryRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/trending-apps', trendingRoutes);
app.use('/api/career-map', careerRoutes);
app.use('/api/career-guide', careerGuideRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', service: 'admin-service' });
});

app.use(errorHandler);

export default app;
