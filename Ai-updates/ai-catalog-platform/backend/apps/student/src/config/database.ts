import { PrismaClient } from '@prisma/client';
import { logger } from '../shared/logger/logger';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to Postgres');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
};
