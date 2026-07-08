import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import pool from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  console.log('Seeding database...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM reservations');
    await client.query('DELETE FROM laptops');
    await client.query('DELETE FROM contact_messages');
    await client.query('DELETE FROM users');

    // Seed from SQL file
    const sqlPath = path.join(__dirname, 'seed.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);

    // Update admin password with proper hash
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(adminPassword, 10);
    await client.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, 'admin']);

    await client.query('COMMIT');
    console.log('Database seeded successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
