import { config } from 'dotenv';
import z from 'zod';

config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(z.treeifyError(_env.error));
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;