import { Pool } from 'pg';
import { env } from '../config/env';

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env and configure it.');
}

export const databasePool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseSsl ? { rejectUnauthorized: true } : undefined,
});

databasePool.on('error', (error) => {
  console.error('Unexpected database pool error:', error);
});
