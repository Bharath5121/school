import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4003'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional().or(z.literal('')),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:3002'),
  SUPABASE_URL: z.string().url().optional().default('https://ftahafqzsblbojvgovmo.supabase.co'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  process.stderr.write(`Invalid environment variables: ${JSON.stringify(_env.error.format())}\n`);
  process.exit(1);
}

export const env = _env.data;
