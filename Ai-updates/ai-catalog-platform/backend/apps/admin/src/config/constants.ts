export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  RATE_LIMITS: {
    GLOBAL: { windowMs: 15 * 60 * 1000, max: 500 },
    AUTH: { windowMs: 15 * 60 * 1000, max: 100 },
    ADMIN: { windowMs: 60 * 1000, max: 200 },
  },
  CACHE_TTL: {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    DAY: 86400,
  },
  CONTENT_TYPES: ['MODEL', 'AGENT', 'APP', 'GUIDE', 'PROMPT', 'SKILL', 'CAREER_JOB'] as const,
  DIFFICULTY_LEVELS: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const,
} as const;

export type ContentType = typeof APP_CONSTANTS.CONTENT_TYPES[number];
export type DifficultyLevel = typeof APP_CONSTANTS.DIFFICULTY_LEVELS[number];
