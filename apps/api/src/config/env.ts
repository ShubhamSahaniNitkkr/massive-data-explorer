import { z } from 'zod';

const envSchema = z.object({
  API_PORT: z.coerce.number().default(4000),
  API_HOST: z.string().default('localhost'),
  SIMULATE_LATENCY_MIN: z.coerce.number().default(20),
  SIMULATE_LATENCY_MAX: z.coerce.number().default(80),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse({
  API_PORT: process.env.PORT ?? process.env.API_PORT,
  API_HOST: process.env.API_HOST,
  SIMULATE_LATENCY_MIN: process.env.SIMULATE_LATENCY_MIN,
  SIMULATE_LATENCY_MAX: process.env.SIMULATE_LATENCY_MAX,
  NODE_ENV: process.env.NODE_ENV,
});
