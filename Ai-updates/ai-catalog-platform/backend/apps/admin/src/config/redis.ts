import Redis from 'ioredis';
import { logger } from '../shared/logger/logger';

const redisUrl = process.env.REDIS_URL;

let client: Redis | null = null;

if (redisUrl) {
  try {
    client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 500, 3000);
      },
      lazyConnect: true,
    });
    client.on('connect', () => logger.info('Connected to Redis'));
    client.on('error', (err) => logger.error('Redis connection error', err));
    client.connect().catch(() => {
      logger.warn('Redis unavailable — running without cache');
    });
  } catch {
    logger.warn('Failed to create Redis client — running without cache');
    client = null;
  }
} else {
  logger.warn('REDIS_URL not set — running without Redis (caching disabled)');
}

const nullRedis = {
  get: async () => null,
  set: async () => 'OK' as const,
  setex: async () => 'OK' as const,
  del: async () => 0,
  keys: async () => [] as string[],
  incr: async () => 0,
  expire: async () => 0,
  disconnect: () => {},
  quit: async () => 'OK' as const,
} as unknown as Redis;

export const redis: Redis = client ?? nullRedis;
