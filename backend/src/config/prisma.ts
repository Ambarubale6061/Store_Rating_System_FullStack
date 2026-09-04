import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Single shared PrismaClient instance for the whole app.
 * Re-using one client (instead of `new PrismaClient()` per request) avoids
 * exhausting the Postgres connection pool.
 */
export const prisma = new PrismaClient({
  log: env.isProduction ? ['error', 'warn'] : ['error', 'warn'],
});
