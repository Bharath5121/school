export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  RATE_LIMITS: {
    GLOBAL: { windowMs: 15 * 60 * 1000, max: 1000 },
    AUTH: { windowMs: 15 * 60 * 1000, max: 500 },
    ASK_AI: { windowMs: 60 * 1000, max: 20 },
  },
  CACHE_TTL: {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    DAY: 86400,
  },
  CONTENT_TYPES: ['MODEL', 'AGENT', 'APP', 'GUIDE', 'PROMPT', 'SKILL', 'CAREER_JOB'] as const,
  TIMEFRAMES: ['today', 'week', 'month', 'all'] as const,
  SKILL_STATUSES: ['NOT_STARTED', 'EXPLORING', 'LEARNED'] as const,
  DIFFICULTY_LEVELS: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const,
} as const;

export type ContentType = typeof APP_CONSTANTS.CONTENT_TYPES[number];
export type Timeframe = typeof APP_CONSTANTS.TIMEFRAMES[number];
export type SkillStatus = typeof APP_CONSTANTS.SKILL_STATUSES[number];
export type DifficultyLevel = typeof APP_CONSTANTS.DIFFICULTY_LEVELS[number];
