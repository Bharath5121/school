const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  info: (...args: unknown[]) => {
    if (!isProd) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (!isProd) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (!isProd) console.error(...args);
  },
};
