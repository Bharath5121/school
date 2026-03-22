export const CacheKeys = {
  dashboard: {
    summary: () => 'admin:dashboard:summary',
    stats: () => 'admin:dashboard:stats',
  },
  industries: {
    all: () => 'admin:industries:all',
    byId: (id: string) => `admin:industries:${id}`,
  },
  models: {
    list: (filter: string) => `admin:models:list:${filter}`,
    byId: (id: string) => `admin:models:${id}`,
  },
  agents: {
    list: (filter: string) => `admin:agents:list:${filter}`,
    byId: (id: string) => `admin:agents:${id}`,
  },
  apps: {
    list: (filter: string) => `admin:apps:list:${filter}`,
    byId: (id: string) => `admin:apps:${id}`,
  },
  guides: {
    list: (filter: string) => `admin:guides:list:${filter}`,
    byId: (id: string) => `admin:guides:${id}`,
  },
  skills: {
    list: (filter: string) => `admin:skills:list:${filter}`,
    byId: (id: string) => `admin:skills:${id}`,
  },
  careers: {
    list: (filter: string) => `admin:careers:list:${filter}`,
    byId: (id: string) => `admin:careers:${id}`,
  },
  basics: {
    list: () => 'admin:basics:all',
    byId: (id: string) => `admin:basics:${id}`,
  },
  feed: {
    list: (filter: string) => `admin:feed:list:${filter}`,
    byId: (id: string) => `admin:feed:${id}`,
  },
  notebooks: {
    list: (filter: string) => `admin:notebooks:list:${filter}`,
    byId: (id: string) => `admin:notebooks:${id}`,
  },
  users: {
    list: (filter: string) => `admin:users:list:${filter}`,
    byId: (id: string) => `admin:users:${id}`,
  },
} as const;
