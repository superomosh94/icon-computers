import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  console.log('Initializing database...');
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Schema created successfully.');
  } catch (err) {
    console.error('Error creating schema:', err.message);
  } finally {
    await pool.end();
  }
}

init();
