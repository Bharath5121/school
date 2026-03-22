import app from './app';
import { env } from './config/env';
import { connectDB, prisma } from './config/database';
import { redis } from './config/redis';
import { logger } from './shared/logger/logger';

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.error('Database connection failed — server starting without DB', err);
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`Student service running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received – shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      redis?.disconnect();
      logger.info('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
