import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const isProd = process.env.NODE_ENV === 'production';

const devFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  colorize(),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `${timestamp} [${level}]: ${message}\n${stack}`
      : `${timestamp} [${level}]: ${message}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: isProd ? 'warn' : 'info',
  format: isProd ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
  silent: false,
});

export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
