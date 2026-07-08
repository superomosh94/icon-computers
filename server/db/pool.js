import pg from 'pg';
import dotenv from 'dotenv';

try { dotenv.config(); } catch {}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/icon_shop',
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  max: 3,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  if (!process.env.VERCEL) process.exit(-1);
});

export default pool;
