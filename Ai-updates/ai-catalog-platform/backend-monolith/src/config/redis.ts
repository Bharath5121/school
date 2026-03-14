import Redis from 'ioredis';
import { logger } from '../shared/logger/logger';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => logger.info('Connected to Redis'));
redis.on('error', (err) => logger.error('Redis connection error', err));
