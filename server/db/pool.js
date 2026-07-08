import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/icon_shop',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  if (!process.env.VERCEL) process.exit(-1);
});

export default pool;
